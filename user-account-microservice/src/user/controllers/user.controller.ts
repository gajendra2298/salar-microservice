import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { GetOtpDto, ChangeTransactionPasswordDto } from '../dto/change-transaction-password.dto';

@ApiTags('User Password Management')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ 
    summary: 'Change user password',
    description: 'Change user password with old password, new password, confirm password, and transaction password validation'
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - passwords do not match or invalid format' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    // Note: userId should be passed in the request body or as a parameter
    // For now, we'll require userId in the DTO
    return this.userService.changePassword(changePasswordDto.userId, changePasswordDto);
  }

  @ApiOperation({ 
    summary: 'Request OTP for transaction password change',
    description: 'Sends a 6-digit numeric OTP to both email and SMS (SMS only for Indian users). Email and mobile are auto-filled from signup.'
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully to email and SMS' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('change-transaction-password-request')
  async changeTransactionPasswordRequest(@Body() getOtpDto: GetOtpDto) {
    return this.userService.changeTransactionPasswordRequest(getOtpDto.userId, getOtpDto);
  }

  @ApiOperation({ 
    summary: 'Change transaction password with OTP',
    description: 'Verify the 6-digit numeric OTP received via email/SMS and set new transaction password with confirmation'
  })
  @ApiResponse({ status: 200, description: 'Transaction password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid OTP, or passwords do not match' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('change-transaction-password')
  async changeTransactionPassword(@Body() changeTransactionPasswordDto: ChangeTransactionPasswordDto) {
    return this.userService.changeTransactionPassword(changeTransactionPasswordDto.userId, changeTransactionPasswordDto);
  }
} 