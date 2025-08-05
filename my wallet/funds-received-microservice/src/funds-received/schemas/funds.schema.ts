import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FundsDocument = Funds & Document;

@Schema({ timestamps: true })
export class Funds {
  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  receiverUserId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: [
      'Referral Comm',
      'Sponsor Comm', 
      'AuS Comm',
      'Product Team Referral Commission',
      'Nova Referral Commission',
      'Royalty Referral Team Commission',
      'Funds'
    ],
    required: true 
  })
  type: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, required: true })
  transactionNo: string;

  @Prop({ 
    type: String, 
    enum: ['Pending', 'Failed', 'Success'],
    default: 'Pending'
  })
  status: string;
}

export const FundsSchema = SchemaFactory.createForClass(Funds); 