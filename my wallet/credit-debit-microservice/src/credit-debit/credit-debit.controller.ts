import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreditDebitService } from './credit-debit.service';

@ApiTags('credit-debit')
@Controller('credit-debit')
export class CreditDebitController {
  constructor(private readonly creditDebitService: CreditDebitService) {}

  @Post('listing')
  @ApiOperation({ summary: 'Get credit/debit listing' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' },
        page: { type: 'number', description: 'Page number' },
        pagesize: { type: 'number', description: 'Page size' },
        startDate: { type: 'string', description: 'Start date (optional)' },
        endDate: { type: 'string', description: 'End date (optional)' },
        searchText: { type: 'string', description: 'Search text (optional)' },
        sort: { type: 'object', description: 'Sort options (optional)' }
      },
      required: ['userId', 'page', 'pagesize']
    }
  })
  @ApiResponse({ status: 200, description: 'Credit/debit listing retrieved successfully' })
  async creditDebitListing(@Body() data: {
    userId: string;
    page: number;
    pagesize: number;
    startDate?: string;
    endDate?: string;
    searchText?: string;
    sort?: any;
  }) {
    return await this.creditDebitService.creditDebitListing(data);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create credit/debit entry' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' },
        reason: { type: 'string', description: 'Reason for credit/debit' },
        orderId: { type: 'string', description: 'Order ID (optional)' },
        status: { 
          type: 'string', 
          enum: ['Credited', 'Debited'],
          description: 'Status of the transaction'
        },
        type: { type: 'string', description: 'Type of transaction' },
        amount: { type: 'number', description: 'Amount' }
      },
      required: ['userId', 'reason', 'status', 'type', 'amount']
    }
  })
  @ApiResponse({ status: 201, description: 'Credit/debit entry created successfully' })
  async createCreditDebit(@Body() creditDebitData: {
    userId: string;
    reason: string;
    orderId?: string;
    status: 'Credited' | 'Debited';
    type: string;
    amount: number;
  }) {
    return await this.creditDebitService.createCreditDebit(creditDebitData);
  }
} 