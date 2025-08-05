import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min, MaxLength, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum CommissionType {
  REFERRAL_COMM = 'Referral Comm',
  SPONSOR_COMM = 'Sponsor Comm',
  AUS_COMM = 'AuS Comm',
  PRODUCT_TEAM_REFERRAL_COMMISSION = 'Product Team Referral Commission',
  NOVA_REFERRAL_COMMISSION = 'Nova Referral Commission',
  ROYALTY_REFERRAL_TEAM_COMMISSION = 'Royalty Referral Team Commission'
}

export const CommissionLabels = {
  [CommissionType.REFERRAL_COMM]: 'Referral Commission',
  [CommissionType.SPONSOR_COMM]: 'Sponsor Commission',
  [CommissionType.AUS_COMM]: 'AuS Commission',
  [CommissionType.PRODUCT_TEAM_REFERRAL_COMMISSION]: 'Product Team Referral Commission',
  [CommissionType.NOVA_REFERRAL_COMMISSION]: 'Nova Referral Commission',
  [CommissionType.ROYALTY_REFERRAL_TEAM_COMMISSION]: 'Royalty Referral Team Commission'
};

export class TransferFormDto {
  @ApiProperty({ 
    description: 'Customer Registered ID of the recipient', 
    example: 'CUST123456', 
    required: true,
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  customerRegisteredId: string;

  @ApiProperty({ 
    description: 'Type of commission to transfer from', 
    enum: CommissionType, 
    example: CommissionType.REFERRAL_COMM, 
    required: true,
    type: 'string'
  })
  @IsEnum(CommissionType)
  @IsNotEmpty()
  commissionType: CommissionType;

  @ApiProperty({ 
    description: 'Amount to transfer (must be less than or equal to available commission amount)', 
    example: 1000.00, 
    minimum: 0.01, 
    required: true,
    type: 'number'
  })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ 
    description: 'Transaction password for verification', 
    example: 'password123', 
    minLength: 6, 
    maxLength: 50, 
    required: true,
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  transactionPassword: string;
} 