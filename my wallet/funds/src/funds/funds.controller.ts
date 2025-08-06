import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FundsService } from './funds.service';
import { FundTransferDto } from './dto/fund-transfer.dto';
import { FundHistoryDto } from './dto/fund-history.dto';
import { UserDetailsDto } from './dto/user-details.dto';
import {
  FundTransferResponseDto,
  FundHistoryListResponseDto,
  UserDetailsResponseDto,
} from './dto/fund-response.dto';

@ApiTags('Funds')
@Controller('funds')
export class FundsController {
  constructor(private readonly fundsService: FundsService) {}

  @Post('dropdown-values')
  @ApiOperation({
    summary: 'Get dropdown values for funds',
    description: 'Retrieve user commission and fund details for dropdown display',
  })
  @ApiResponse({
    status: 200,
    description: 'User details retrieved successfully',
    type: UserDetailsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - User details not found',
  })
  async getDropdownValuesForFunds(@Body() userDetailsDto: UserDetailsDto) {
    try {
      const { userId } = userDetailsDto;
      return await this.fundsService.getDropdownValuesForFunds(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: 0,
          message: error.message || 'Internal server error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('transfer')
  @ApiOperation({
    summary: 'Transfer funds',
    description: 'Transfer funds from one user to another with proper validations',
  })
  @ApiResponse({
    status: 201,
    description: 'Funds transferred successfully',
    type: FundTransferResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Validation failed or insufficient funds',
  })
  async fundTransfer(@Body() fundTransferDto: FundTransferDto) {
    try {
      const { userId } = fundTransferDto;
      return await this.fundsService.fundTransfer(userId, fundTransferDto);
    } catch (error) {
      throw new HttpException(
        {
          status: 0,
          message: error.message || 'Internal server error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('transfer-history')
  @ApiOperation({
    summary: 'Get funds transfer history',
    description: 'Retrieve paginated list of funds sent by the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Transfer history retrieved successfully',
    type: FundHistoryListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid parameters',
  })
  async fundsTransferHistoryListing(@Body() historyDto: FundHistoryDto) {
    try {
      const { userId } = historyDto;
      return await this.fundsService.fundsTransferHistoryListing(userId, historyDto);
    } catch (error) {
      throw new HttpException(
        {
          status: 0,
          message: error.message || 'Internal server error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('received-history')
  @ApiOperation({
    summary: 'Get funds received history',
    description: 'Retrieve paginated list of funds received by the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Received history retrieved successfully',
    type: FundHistoryListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid parameters',
  })
  async fundsReceivedHistoryListing(@Body() historyDto: FundHistoryDto) {
    try {
      const { userId } = historyDto;
      return await this.fundsService.fundsReceivedHistoryListing(userId, historyDto);
    } catch (error) {
      throw new HttpException(
        {
          status: 0,
          message: error.message || 'Internal server error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('transaction/:transactionNo')
  @ApiOperation({
    summary: 'Get transaction details',
    description: 'Retrieve details of a specific transaction by transaction number',
  })
  @ApiParam({
    name: 'transactionNo',
    description: 'Transaction number to search for',
    example: 'FABCD123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction details retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  async getTransactionDetails(@Param('transactionNo') transactionNo: string) {
    try {
      return await this.fundsService.getFundRecordByTransactionNo(transactionNo);
    } catch (error) {
      throw new HttpException(
        {
          status: 0,
          message: error.message || 'Transaction not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('all-records')
  @ApiOperation({
    summary: 'Get all fund records for a user',
    description: 'Retrieve all fund records (both sent and received) for a specific user',
  })
  @ApiResponse({
    status: 200,
    description: 'Fund records retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid user ID',
  })
  async getAllFundRecords(@Body() userDetailsDto: UserDetailsDto) {
    try {
      const { userId } = userDetailsDto;
      return await this.fundsService.getAllFundRecordsByUserId(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: 0,
          message: error.message || 'Internal server error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('statistics')
  @ApiOperation({
    summary: 'Get fund statistics for a user',
    description: 'Retrieve comprehensive fund statistics including sent, received, and net amounts',
  })
  @ApiResponse({
    status: 200,
    description: 'Fund statistics retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid user ID',
  })
  async getFundStatistics(@Body() userDetailsDto: UserDetailsDto) {
    try {
      const { userId } = userDetailsDto;
      return await this.fundsService.getFundStatisticsByUserId(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: 0,
          message: error.message || 'Internal server error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
} 