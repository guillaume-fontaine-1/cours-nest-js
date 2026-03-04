import {Controller, Post, Body, Param, Get} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {UsersService} from "./users.service";

@Controller('auth')
export class UsersController {

    constructor(private usersService: UsersService) {
    }

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto.email, createUserDto.password);
  }

  @Get('/:id')
    findById(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }
}
