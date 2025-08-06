import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FundsDocument = Funds & Document;

export enum FundType {
  SPONSOR_COMMISSION = 'Sponser Commission',
  AUR_COMMISSION = 'Aur Commission',
  GAME_COMMISSION = 'Game Commission',
  FUNDS = 'Funds',
  PRT_COMMISSION = 'PRT Commission',
}

export enum FundStatus {
  PENDING = 'Pending',
  FAILED = 'Failed',
  SUCCESS = 'Success',
}

@Schema({ timestamps: true })
export class Funds {
  @Prop({ type: String, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  receiverUserId: string;

  @Prop({ 
    type: String, 
    enum: Object.values(FundType),
    required: true 
  })
  type: FundType;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, required: true, unique: true })
  transactionNo: string;

  @Prop({ 
    type: String, 
    enum: Object.values(FundStatus),
    default: FundStatus.PENDING 
  })
  status: FundStatus;
}

export const FundsSchema = SchemaFactory.createForClass(Funds); 