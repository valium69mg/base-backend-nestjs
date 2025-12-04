import type {Request, Response} from 'express';
import { Controller, Post, Body, UnauthorizedException, HttpException, HttpStatus, Res, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    const user = await this.userService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      userId: user.user_id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '5m',
    });

    let refreshTokenOpt = await this.userService.getUserRefreshToken(user.user_id);
    let refreshToken: string | null = null;
    if (refreshTokenOpt === null) {
      refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      });
      await this.userService.saveUserRefreshToken(user.user_id, refreshToken);
    } else {
      refreshToken = refreshTokenOpt;
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });

  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken']
      
    if (!refreshToken) {
        throw new HttpException('Refresh token missing', HttpStatus.UNAUTHORIZED);
    }
   
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
    } catch (e) {
      throw new HttpException('Invalid or expired refresh token', HttpStatus.UNAUTHORIZED);
    }

    const isRefreshTokenValid = await this.userService.isRefreshTokenValid(payload.userId, refreshToken);
      if (isRefreshTokenValid) {
        const user = await this.userService.getUserById(payload.userId);
        const newPayload = {
          userId: user.userId,
          email: user.email,
        };
        const accessToken = this.jwtService.sign(newPayload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '5m',
        });

        const refreshToken = this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '30d',
        });
        await this.userService.saveUserRefreshToken(user.userId, refreshToken);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.json({ accessToken });
      }
      throw new HttpException("Your refresh token is invalid", HttpStatus.UNAUTHORIZED);
  }

  @Post('logout')
  async logout(@Body() body: {userId: string}, @Res() res: Response) {
    await this.userService.deleteRefreshTokens(body.userId);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
    });
    return res.json({ message: 'Logged out successfully' });
  }

 
}
