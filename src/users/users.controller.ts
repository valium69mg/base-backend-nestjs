import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './users.service';
import { Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import type { CreateUserDTO } from './dto/create-user.dto';
import GetUserDTO from './dto/get-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDTO): Promise<object> {
    await this.userService.create(createUserDto);
    return { message: 'User created succesfully' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers() : Promise<Array<GetUserDTO>> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') userId : string) : Promise<GetUserDTO> {
    return await this.userService.getUserById(userId);
  }
}
