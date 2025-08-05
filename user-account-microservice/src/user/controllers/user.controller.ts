import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { GetOtpDto, ChangeTransactionPasswordDto } from '../dto/change-transaction-password.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('User Password Management')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Change user password',
    description: 'Change user password with old password, new password, confirm password, and transaction password validation'
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - passwords do not match or invalid format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.userId, changePasswordDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Request OTP for transaction password change',
    description: 'Sends a 6-digit numeric OTP to both email and SMS (SMS only for Indian users). Email and mobile are auto-filled from signup.'
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully to email and SMS' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(JwtAuthGuard)
  @Post('change-transaction-password-request')
  async changeTransactionPasswordRequest(@Request() req, @Body() getOtpDto: GetOtpDto) {
    return this.userService.changeTransactionPasswordRequest(req.user.userId, getOtpDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Change transaction password with OTP',
    description: 'Verify the 6-digit numeric OTP received via email/SMS and set new transaction password with confirmation'
  })
  @ApiResponse({ status: 200, description: 'Transaction password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid OTP, or passwords do not match' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Post('change-transaction-password')
  async changeTransactionPassword(@Request() req, @Body() changeTransactionPasswordDto: ChangeTransactionPasswordDto) {
    return this.userService.changeTransactionPassword(req.user.userId, changeTransactionPasswordDto);
  }
} 