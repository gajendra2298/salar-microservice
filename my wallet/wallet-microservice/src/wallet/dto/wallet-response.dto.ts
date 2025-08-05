import { ApiProperty } from '@nestjs/swagger';

export class WalletResponseDto {
  @ApiProperty({
    description: 'Operation status (1 for success, 0 for failure)',
    example: 1
  })
  status: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Wallet balance retrieved successfully'
  })
  message: string;

  @ApiProperty({
    description: 'Wallet data',
    example: {
      userId: '507f1f77bcf86cd799439011',
      balance: 1000.50,
      currency: 'USD',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    required: false
  })
  data?: any;
} 