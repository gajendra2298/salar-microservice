import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPendingTeamMembersDto {
  @ApiProperty({
    description: 'User ID of the current user',
    example: 'REG123456789',
    required: true
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Search text to filter pending team members',
    example: 'john',
    required: false
  })
  @IsString()
  @IsOptional()
  searchText?: string;
} 