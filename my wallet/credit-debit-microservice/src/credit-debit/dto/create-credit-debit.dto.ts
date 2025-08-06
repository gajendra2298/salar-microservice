import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsIn } from 'class-validator';

export class CreateCreditDebitDto {
  @ApiProperty({
    description: 'User ID (can be registerId, emailId, or MongoDB ObjectId)',
    example: 'REG123456789',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Reason for the credit/debit transaction',
    example: 'Referral Bonus',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'Order ID (optional)',
    example: 'ORDER123',
    required: false
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({
    description: 'Status of the transaction',
    enum: ['Credited', 'Debited'],
    example: 'Credited',
    required: true
  })
  @IsString()
  @IsIn(['Credited', 'Debited'])
  @IsNotEmpty()
  status: 'Credited' | 'Debited';

  @ApiProperty({
    description: 'Type of transaction',
    example: 'Referral Comm',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Amount of the transaction',
    example: 100,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
} 