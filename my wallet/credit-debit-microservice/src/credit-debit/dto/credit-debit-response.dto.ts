import { ApiProperty } from '@nestjs/swagger';

export class CreditDebitTransactionDto {
  @ApiProperty({
    description: 'Transaction creation date',
    example: '2024-01-15T10:30:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Unique transaction number',
    example: 'CDABC123456789'
  })
  transactionNo: string;

  @ApiProperty({
    description: 'Status of the transaction',
    example: 'Credited'
  })
  status: string;

  @ApiProperty({
    description: 'Type of transaction',
    example: 'Referral Comm'
  })
  type: string;

  @ApiProperty({
    description: 'Amount of the transaction',
    example: 100
  })
  amount: number;

  @ApiProperty({
    description: 'Reason for the transaction',
    example: 'Referral Bonus'
  })
  reason: string;

  @ApiProperty({
    description: 'Order ID (if applicable)',
    example: 'ORDER123'
  })
  orderId?: string;
}

export class CreditDebitListingResponseDto {
  @ApiProperty({
    description: 'Response status (1 for success, 0 for error)',
    example: 1
  })
  status: number;

  @ApiProperty({
    description: 'Array of credit/debit transactions',
    type: [CreditDebitTransactionDto]
  })
  data: CreditDebitTransactionDto[];

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  pagesize: number;

  @ApiProperty({
    description: 'Total number of transactions',
    example: 25
  })
  total: number;
}

export class CreateCreditDebitResponseDto {
  @ApiProperty({
    description: 'Response status (1 for success, 0 for error)',
    example: 1
  })
  status: number;

  @ApiProperty({
    description: 'Success message',
    example: 'Credit/Debit transaction created successfully'
  })
  message: string;

  @ApiProperty({
    description: 'Created transaction details',
    type: CreditDebitTransactionDto
  })
  data: CreditDebitTransactionDto;
} 