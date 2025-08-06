import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreditDebitService } from './credit-debit.service';
import { CreditDebitListingDto } from './dto/credit-debit-listing.dto';
import { CreateCreditDebitDto } from './dto/create-credit-debit.dto';
import { CreditDebitListingResponseDto, CreateCreditDebitResponseDto } from './dto/credit-debit-response.dto';

@ApiTags('credit-debit')
@Controller('credit-debit')
export class CreditDebitController {
  constructor(private readonly creditDebitService: CreditDebitService) {}

  @Post('listing')
  @ApiOperation({ 
    summary: 'Get credit/debit listing',
    description: 'Retrieve paginated list of credit/debit transactions with optional filtering and search'
  })
  @ApiBody({ type: CreditDebitListingDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Credit/debit listing retrieved successfully',
    type: CreditDebitListingResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid parameters or user not found'
  })
  async creditDebitListing(@Body() data: CreditDebitListingDto) {
    return await this.creditDebitService.creditDebitListing(data);
  }

  @Post('create')
  @ApiOperation({ 
    summary: 'Create credit/debit entry',
    description: 'Create a new credit or debit transaction for a user'
  })
  @ApiBody({ type: CreateCreditDebitDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Credit/debit entry created successfully',
    type: CreateCreditDebitResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid parameters or user not found'
  })
  async createCreditDebit(@Body() creditDebitData: CreateCreditDebitDto) {
    return await this.creditDebitService.createCreditDebit(creditDebitData);
  }
} 