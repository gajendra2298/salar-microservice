import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DateFilterDto {
  @ApiProperty({ 
    description: 'Start date for filtering (optional)', 
    example: '2024-01-01',
    required: false 
  })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ 
    description: 'End date for filtering (optional)', 
    example: '2024-12-31',
    required: false 
  })
  @IsString()
  @IsOptional()
  endDate?: string;
}

export class GetSponsorTeamDto {
  @ApiProperty({ 
    description: 'Search text for filtering (optional)', 
    example: 'John',
    required: false 
  })
  @IsString()
  @IsOptional()
  searchText?: string;

  @ApiProperty({ 
    description: 'Date filter object (optional)', 
    type: DateFilterDto,
    required: false 
  })
  @IsObject()
  @IsOptional()
  filter?: DateFilterDto;

  @ApiProperty({ 
    description: 'Current page number (default: 1)', 
    example: 1,
    default: 1,
    required: false 
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  currentPage?: number = 1;

  @ApiProperty({ 
    description: 'Number of items per page (default: 10)', 
    example: 10,
    default: 10,
    required: false 
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  itemsPerPage?: number = 10;
} 