import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class UsersController {
  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
      console.log(createUserDto)
    return createUserDto;
  }
}
