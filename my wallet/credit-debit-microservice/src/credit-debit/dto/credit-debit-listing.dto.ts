import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreditDebitListingDto {
  @ApiProperty({
    description: 'User ID (can be registerId, emailId, or MongoDB ObjectId)',
    example: 'REG123456789',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  pagesize: number;

  @ApiProperty({
    description: 'Start date for filtering (YYYY-MM-DD format)',
    example: '2024-01-01',
    required: false
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for filtering (YYYY-MM-DD format)',
    example: '2024-12-31',
    required: false
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({
    description: 'Search text to filter by transaction type, number, reason, status, or order ID',
    example: 'Funds',
    required: false
  })
  @IsOptional()
  @IsString()
  searchText?: string;

  @ApiProperty({
    description: 'Sort options (e.g., { createdAt: -1 } for newest first)',
    example: { createdAt: -1 },
    required: false
  })
  @IsOptional()
  sort?: any;
} 