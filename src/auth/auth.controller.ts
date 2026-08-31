import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthResponseDto,
  CreateUserDto,
  LoginResponseDto,
  LoginUserDto,
  PrivateRouteResponseDto,
  PrivateTestResponseDto,
} from './dto/';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { RawHeaders, GetUser, Auth } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User registered and access token issued',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or the email is already registered',
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiOkResponse({
    description: 'Credentials accepted and access token issued',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Request body validation failed' })
  @ApiUnauthorizedResponse({ description: 'Credentials are not valid' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  @ApiOperation({ summary: 'Validate the current token and refresh it' })
  @ApiOkResponse({
    description: 'Current user and a refreshed access token',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token is missing or invalid' })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exercise the JWT guard and user decorators' })
  @ApiOkResponse({ type: PrivateTestResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token is missing or invalid' })
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      ok: true,
      message: 'hello world private',
      user,
      userEmail,
      rawHeaders,
    };
  }

  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exercise role-based authorization' })
  @ApiOkResponse({ type: PrivateRouteResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token is missing or invalid' })
  @ApiForbiddenResponse({ description: 'User lacks an allowed role' })
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth()
  @ApiOperation({ summary: 'Exercise the composed authentication decorator' })
  @ApiOkResponse({ type: PrivateRouteResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token is missing or invalid' })
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
