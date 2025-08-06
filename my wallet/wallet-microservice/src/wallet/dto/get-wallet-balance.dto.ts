import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetWalletBalanceDto {
  @ApiProperty({
    description: 'User ID (can be registerId, emailId, or MongoDB ObjectId)',
    example: 'REG123456789',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
} 