import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    Query,
    NotFoundException,
    UseInterceptors, Session,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from '../interceptors/dto-serialize.interceptor';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/whoami')
  @UseInterceptors(new SerializeInterceptor(UserResponseDto))
  whoAmI(@Session() session: any) {
    return this.usersService.findOne(session.userId);
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  @UseInterceptors(new SerializeInterceptor(UserResponseDto))
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.usersService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  @UseInterceptors(new SerializeInterceptor(UserResponseDto))
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.usersService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  @UseInterceptors(new SerializeInterceptor(UserResponseDto))
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
