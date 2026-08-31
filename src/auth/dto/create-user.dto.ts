import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Unique email address used to sign in',
    format: 'email',
  })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password1',
    description:
      'Password containing uppercase and lowercase letters plus a number or symbol',
    minLength: 6,
    maxLength: 50,
    format: 'password',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password!: string;

  @ApiProperty({
    example: 'Ada Lovelace',
    description: 'Display name of the user',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  fullName!: string;
}
