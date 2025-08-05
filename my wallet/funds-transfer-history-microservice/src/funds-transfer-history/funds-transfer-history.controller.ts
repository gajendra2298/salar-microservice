import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FundsTransferHistoryService } from './funds-transfer-history.service';

// DTO for the request body
class FundsTransferHistoryDto {
  userId: string;
  page: number;
  pagesize: number;
  startDate?: string;
  endDate?: string;
  searchText?: string;
  sort?: any;
}

// DTO for the response
class FundsTransferHistoryResponseDto {
  status: number;
  data?: any[];
  page?: number;
  pagesize?: number;
  total?: number;
  message?: string;
}

@ApiTags('funds-transfer-history')
@Controller('funds-transfer-history')
export class FundsTransferHistoryController {
  constructor(private readonly fundsTransferHistoryService: FundsTransferHistoryService) {}

  @Post('listing')
  @ApiOperation({ 
    summary: 'Get funds transfer history listing',
    description: 'Retrieve paginated funds transfer history with optional filtering and search'
  })
  @ApiBody({ 
    type: FundsTransferHistoryDto,
    description: 'Request parameters for funds transfer history listing'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved funds transfer history',
    type: FundsTransferHistoryResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error',
    type: FundsTransferHistoryResponseDto
  })
  async fundsTransferHistoryListing(@Body() data: FundsTransferHistoryDto): Promise<FundsTransferHistoryResponseDto> {
    return await this.fundsTransferHistoryService.fundsTransferHistoryListing(data);
  }
} 