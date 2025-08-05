import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetOtpDto {
  @ApiProperty({
    description: 'Email address where OTP will be sent (auto-filled from signup)',
    example: 'user@example.com'
  })
  @IsString()
  @IsNotEmpty()
  emailId: string;

  @ApiProperty({
    description: 'Mobile number where OTP will be sent (auto-filled from signup, SMS for Indian users)',
    example: '+919876543210'
  })
  @IsString()
  @IsNotEmpty()
  mobileNo: string;
}

export class ChangeTransactionPasswordDto {
  @ApiProperty({
    description: '6-digit numeric OTP received via email and SMS',
    example: '123456',
    maxLength: 6,
    pattern: '^[0-9]{6}$'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  @Matches(/^[0-9]{6}$/, {
    message: 'OTP must be exactly 6 digits numeric',
  })
  otp: string;

  @ApiProperty({
    description: 'New transaction password',
    example: 'NewTransPass123!',
    maxLength: 15,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Transaction password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newTransactionPassword: string;

  @ApiProperty({
    description: 'Confirm new transaction password (must match new transaction password)',
    example: 'NewTransPass123!',
    maxLength: 15,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Transaction password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  confirmTransactionPassword: string;
} 