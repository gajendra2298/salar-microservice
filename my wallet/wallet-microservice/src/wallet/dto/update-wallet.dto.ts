import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsMongoId } from 'class-validator';

export class UpdateWalletDto {
  @ApiProperty({
    description: 'User ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    required: true
  })
  @IsString()
  @IsMongoId()
  userId: string;

  @ApiProperty({
    description: 'Referral commission amount',
    example: 100.50,
    required: false
  })
  @IsOptional()
  @IsNumber()
  referralComm?: number;

  @ApiProperty({
    description: 'Sponsor commission amount',
    example: 50.25,
    required: false
  })
  @IsOptional()
  @IsNumber()
  sponsorComm?: number;

  @ApiProperty({
    description: 'AUS commission amount',
    example: 75.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  ausComm?: number;

  @ApiProperty({
    description: 'Product team referral commission amount',
    example: 25.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  productTeamReferralCommission?: number;

  @ApiProperty({
    description: 'Nova referral commission amount',
    example: 30.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  novaReferralCommission?: number;

  @ApiProperty({
    description: 'Royalty referral team commission amount',
    example: 40.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  royaltyReferralTeamCommission?: number;

  @ApiProperty({
    description: 'Shopping amount',
    example: 200.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  shoppingAmount?: number;

  @ApiProperty({
    description: 'Salar coins amount',
    example: 150.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  salarCoins?: number;

  @ApiProperty({
    description: 'Royalty credits amount',
    example: 80.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  royaltyCredits?: number;

  @ApiProperty({
    description: 'Salar gift credits amount',
    example: 60.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  salarGiftCredits?: number;

  @ApiProperty({
    description: 'Funds amount',
    example: 500.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  funds?: number;
} 