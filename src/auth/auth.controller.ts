import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { RawHeaders, GetUser } from './decorators';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }  

  @Get('private')
  @UseGuards( AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user : User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ){
    return {
      ok: true,
      message: 'hello world private',
      user,
      userEmail,
      rawHeaders
    }
  }
 

}
