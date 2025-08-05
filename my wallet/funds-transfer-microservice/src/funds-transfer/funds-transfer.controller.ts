import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { FundsTransferService } from './funds-transfer.service';

// DTO classes for Swagger documentation
class TransferDataDto {
  userId: string;
  registerId: string;
  amount: number;
  type: string;
  transactionPassword: string;
}

@ApiTags('funds-transfer')
@Controller('funds-transfer')
export class FundsTransferController {
  constructor(private readonly fundsTransferService: FundsTransferService) {}

  @Get('dropdown-values/:userId')
  @ApiOperation({ summary: 'Get dropdown values for funds transfer', description: 'Retrieves available options for funds transfer dropdown based on user ID from external user service' })
  @ApiParam({ name: 'userId', description: 'User ID to get dropdown values for' })
  @ApiResponse({ status: 200, description: 'Dropdown values retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized access to user service' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 503, description: 'User service unavailable' })
  @ApiResponse({ status: 408, description: 'Request timeout' })
  async getDropdownValuesForFunds(@Param('userId') userId: string) {
    try {
      return await this.fundsTransferService.getDropdownValuesForFunds(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer funds', description: 'Transfer funds between accounts with transaction password verification using external services' })
  @ApiBody({ type: TransferDataDto, description: 'Transfer data including user details and amount' })
  @ApiResponse({ status: 201, description: 'Funds transferred successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid transfer data, insufficient balance, or same user transfer' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid transaction password' })
  @ApiResponse({ status: 404, description: 'Receiver user not found' })
  @ApiResponse({ status: 503, description: 'External services unavailable' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async fundTransfer(@Body() transferData: TransferDataDto) {
    try {
      return await this.fundsTransferService.fundTransfer(transferData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error during fund transfer',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 