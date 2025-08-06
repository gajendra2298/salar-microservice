import { ApiProperty } from '@nestjs/swagger';
import { FundType, FundStatus } from '../schemas/funds.schema';

export class FundResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  receiverUserId: string;

  @ApiProperty({ enum: FundType })
  type: FundType;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  transactionNo: string;

  @ApiProperty({ enum: FundStatus })
  status: FundStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class FundHistoryResponseDto {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  transactionNo: string;

  @ApiProperty({ enum: FundType })
  commissionName: FundType;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: FundStatus;

  @ApiProperty()
  receiver?: {
    _id: string;
    fullName: string;
    registerId: string;
  };

  @ApiProperty()
  sender?: {
    _id: string;
    fullName: string;
    registerId: string;
    imageUrl?: string;
  };
}

export class FundHistoryListResponseDto {
  @ApiProperty()
  status: number;

  @ApiProperty({ type: [FundHistoryResponseDto] })
  data: FundHistoryResponseDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  pagesize: number;

  @ApiProperty()
  total: number;
}

export class FundTransferResponseDto {
  @ApiProperty()
  status: number;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: any;
}

export class UserDetailsResponseDto {
  @ApiProperty()
  status: number;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: {
    sponserCommission: number;
    aurCommission: number;
    gameCommission: number;
    funds: number;
  };
} 