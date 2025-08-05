import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min, MaxLength } from 'class-validator';

export class TransferDataDto {
  @ApiProperty({
    description: 'User ID of the sender',
    example: '507f1f77bcf86cd799439011',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Register ID of the receiver',
    example: '507f1f77bcf86cd799439012',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  registerId: string;

  @ApiProperty({
    description: 'Amount to transfer',
    example: 1000.50,
    minimum: 0.01,
    required: true
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Type of transfer',
    example: 'transfer',
    enum: ['transfer', 'credit', 'debit'],
    required: true
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Transaction password for verification',
    example: 'password123',
    minLength: 6,
    maxLength: 50,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  transactionPassword: string;
} 