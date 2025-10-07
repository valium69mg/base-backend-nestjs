import { Controller } from "@nestjs/common";
import { UserService } from "./users.service";
import { Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import type { CreateUserDTO } from "./dto/create-user.dto";

@Controller('users')
export class UserController {
    constructor(private userService : UserService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto : CreateUserDTO) : Promise<object> {
        await this.userService.create(createUserDto);
        return {message : "User created succesfully"}
    }
}