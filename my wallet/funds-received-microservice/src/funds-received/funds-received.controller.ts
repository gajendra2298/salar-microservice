import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FundsReceivedService } from './funds-received.service';
import { FundsReceivedListingDto, FundsReceivedResponseDto } from './dto/funds-received.dto';

@ApiTags('Funds Received')
@Controller('funds-received')
export class FundsReceivedController {
  constructor(private readonly fundsReceivedService: FundsReceivedService) {}

  @Post('listing')
  @ApiOperation({
    summary: 'Get funds received history listing',
    description: 'Retrieve a paginated list of funds received for a specific user with optional filtering and sorting'
  })
  @ApiBody({
    type: FundsReceivedListingDto,
    description: 'Request body for funds received listing'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved funds received listing',
    type: FundsReceivedResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input parameters'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  async fundsReceivedHistoryListing(@Body() data: FundsReceivedListingDto): Promise<FundsReceivedResponseDto> {
    return await this.fundsReceivedService.fundsReceivedHistoryListing(data);
  }
} 