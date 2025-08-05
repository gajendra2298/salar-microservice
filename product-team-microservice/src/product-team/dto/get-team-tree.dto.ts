import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetTeamTreeDto {
  @ApiProperty({
    description: 'Search text to filter team tree members',
    example: 'john',
    required: false
  })
  @IsString()
  @IsOptional()
  searchText?: string;

  @ApiProperty({
    description: 'Level depth for team tree',
    example: 3,
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  level?: number;

  @ApiProperty({
    description: 'Register ID to get team tree for specific user',
    example: '507f1f77bcf86cd799439011',
    required: false
  })
  @IsString()
  @IsOptional()
  registerId?: string;
} 