import { Controller, Get, Post, Body, Param, HttpStatus, HttpException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
import { Types } from 'mongoose';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance/:userId')
  @ApiOperation({ summary: 'Get wallet balance for a user' })
  @ApiParam({ name: 'userId', description: 'User ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ 
    status: 200, 
    description: 'Wallet balance retrieved successfully',
    type: WalletResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async getWalletBalance(@Param('userId') userId: string): Promise<WalletResponseDto> {
    // Validate userId
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const result = await this.walletService.getWalletBalance(userId);
    
    if (result.status === 0) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Post('update-balance')
  @ApiOperation({ summary: 'Update wallet balance for a user' })
  @ApiBody({ type: UpdateWalletDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Wallet balance updated successfully',
    type: WalletResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async updateWalletBalance(@Body() updateWalletDto: UpdateWalletDto): Promise<WalletResponseDto> {
    // Validate required fields
    if (!updateWalletDto.userId) {
      throw new BadRequestException('userId is required');
    }

    if (!Types.ObjectId.isValid(updateWalletDto.userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    // Remove userId from updates object
    const { userId, ...updates } = updateWalletDto;

    const result = await this.walletService.updateWalletBalance(userId, updates);
    
    if (result.status === 0) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }
} 