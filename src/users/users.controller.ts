import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from '../interceptors/dto-serialize.interceptor';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(
      createUserDto.email,
      createUserDto.password,
    );
  }

  @Get('/:id')
  @UseInterceptors(new SerializeInterceptor(UserResponseDto))
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  findUserByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }


}
