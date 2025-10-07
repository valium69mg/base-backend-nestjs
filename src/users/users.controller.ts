import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import type { CreateUserDTO } from './dto/create-user.dto';
import GetUserDTO from './dto/get-user.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDTO): Promise<object> {
    await this.userService.create(createUserDto);
    return { statusCode: 201, message: 'User created succesfully' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<Array<GetUserDTO>> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') userId: string): Promise<GetUserDTO> {
    return await this.userService.getUserById(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteUserById(
    @Param('id') userId: string,
    @Req() req: Request,
  ): Promise<object> {
    const currentUser = req.user;
    if (req.user.userId === userId) {
      throw new HttpException(
        'You cannot delete your own user',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.userService.deleteUserById(userId);
    return { statusCode: 202, message: 'User deleted succesfully' };
  }
}
