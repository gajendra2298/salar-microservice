import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetNetworkCountDto {
  @ApiProperty({
    description: 'User ID of the current user',
    example: 'REG123456789',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
} 