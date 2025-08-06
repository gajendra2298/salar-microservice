import { IsString, IsNumber, IsEnum, IsNotEmpty, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FundType } from '../schemas/funds.schema';

export class FundTransferDto {
  @ApiProperty({
    description: 'User ID of the sender',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Register ID of the receiver',
    example: 'USER123',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  registerId: string;

  @ApiProperty({
    description: 'Amount to transfer',
    example: 100,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'Type of fund to transfer',
    enum: FundType,
    example: FundType.SPONSOR_COMMISSION,
  })
  @IsEnum(FundType)
  type: FundType;

  @ApiProperty({
    description: 'Transaction password for authentication',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  transactionPassword: string;
} 