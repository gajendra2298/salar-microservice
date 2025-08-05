import { IsString, IsNotEmpty, IsEmail, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe'
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  emailId: string;

  @ApiProperty({
    description: 'User mobile number',
    example: '+919876543210'
  })
  @IsString()
  @IsNotEmpty()
  mobileNo: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123!',
    maxLength: 15,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'regular',
    enum: ['regular', 'admin']
  })
  @IsString()
  @IsNotEmpty()
  role: string;
} 