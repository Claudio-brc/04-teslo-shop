import { ApiProperty } from '@nestjs/swagger';
import { ValidRoles } from '../interfaces';

export class UserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'user@example.com', format: 'email' })
  email!: string;

  @ApiProperty({ example: 'Ada Lovelace' })
  fullName!: string;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ enum: ValidRoles, isArray: true, example: [ValidRoles.user] })
  roles!: ValidRoles[];
}

export class AuthResponseDto extends UserResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  token!: string;
}

export class LoginResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'user@example.com', format: 'email' })
  email!: string;

  @ApiProperty({ description: 'JWT access token' })
  token!: string;
}

export class PrivateRouteResponseDto {
  @ApiProperty({ example: true })
  ok!: boolean;

  @ApiProperty({ type: () => UserResponseDto })
  user!: UserResponseDto;
}

export class PrivateTestResponseDto extends PrivateRouteResponseDto {
  @ApiProperty({ example: 'hello world private' })
  message!: string;

  @ApiProperty({ example: 'user@example.com', format: 'email' })
  userEmail!: string;

  @ApiProperty({ type: [String], description: 'Raw HTTP request headers' })
  rawHeaders!: string[];
}
