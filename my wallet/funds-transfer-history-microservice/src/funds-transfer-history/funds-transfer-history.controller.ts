import { Controller, Get, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FundsTransferHistoryService, TransferHistoryData } from './funds-transfer-history.service';

@ApiTags('funds-transfer-history')
@Controller('funds-transfer-history')
export class FundsTransferHistoryController {
  constructor(private readonly fundsTransferHistoryService: FundsTransferHistoryService) {}

  @Post('save-transfer')
  @ApiOperation({
    summary: 'Save transfer history',
    description: 'Save transfer history from funds-transfer-microservice. This endpoint is called automatically when a transfer is processed.'
  })
  @ApiBody({
    description: 'Transfer history data to save',
    schema: {
      type: 'object',
      properties: {
        senderUserId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        receiverUserId: { type: 'string', example: '507f1f77bcf86cd799439012' },
        receiverCustomerRegisteredId: { type: 'string', example: 'CUST123456' },
        customerName: { type: 'string', example: 'John Doe' },
        commissionType: { type: 'string', example: 'Referral Comm' },
        amount: { type: 'number', example: 1000.00 },
        adminCharges: { type: 'number', example: 50.00 },
        netPayable: { type: 'number', example: 950.00 },
        fundsTransactionNo: { type: 'string', example: 'TXN20241201001' },
        status: { type: 'string', enum: ['Success', 'Failed'], example: 'Success' },
        failureReason: { type: 'string', example: 'Insufficient balance' }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Transfer history saved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Transfer history saved successfully' },
        data: {
          type: 'object',
          properties: {
            serialNo: { type: 'number', example: 1 },
            transferDate: { type: 'string', example: '2024-12-01T10:30:00.000Z' },
            receiverCustomerRegisteredId: { type: 'string', example: 'CUST123456' },
            customerName: { type: 'string', example: 'John Doe' },
            fundsTransactionNo: { type: 'string', example: 'TXN20241201001' },
            status: { type: 'string', example: 'Success' }
          }
        }
      }
    }
  })
  async saveTransferHistory(@Body() transferData: TransferHistoryData) {
    try {
      return await this.fundsTransferHistoryService.saveTransferHistory(transferData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error saving transfer history',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get funds transfer history',
    description: 'Retrieve funds transfer history as shown in the image. Returns S.No, Date, Receiver Customer Registered ID, Customer Name, Funds Transaction No, and Status for each transfer.'
  })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID (sender or receiver)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', type: 'number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records per page', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Transfer history retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Transfer history retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            history: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  serialNo: { type: 'number', example: 1 },
                  date: { type: 'string', example: '12/01/2024' },
                  receiverCustomerRegisteredId: { type: 'string', example: 'CUST123456' },
                  customerName: { type: 'string', example: 'John Doe' },
                  fundsTransactionNo: { type: 'string', example: 'TXN20241201001' },
                  status: { type: 'string', enum: ['Success', 'Failed'], example: 'Success' }
                }
              }
            },
            pagination: {
              type: 'object',
              properties: {
                currentPage: { type: 'number', example: 1 },
                totalPages: { type: 'number', example: 5 },
                totalRecords: { type: 'number', example: 50 },
                recordsPerPage: { type: 'number', example: 10 }
              }
            }
          }
        }
      }
    }
  })
  async getTransferHistory(
    @Query('userId') userId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    try {
      return await this.fundsTransferHistoryService.getTransferHistory(userId, page, limit);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error retrieving transfer history',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 