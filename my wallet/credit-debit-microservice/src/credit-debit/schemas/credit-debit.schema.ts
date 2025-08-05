import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CreditDebitDocument = CreditDebit & Document;

@Schema({ timestamps: true })
export class CreditDebit {
  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  reason: string;

  @Prop({ type: String })
  orderId: string;

  @Prop({ 
    type: String, 
    enum: ['Credited', 'Debited'],
    required: true 
  })
  status: string;

  @Prop({ 
    type: String, 
    enum: [
      'Referral Comm',
      'Sponsor Comm', 
      'AuS Comm',
      'Product Team Referral Commission',
      'Nova Referral Commission',
      'Royalty Referral Team Commission',
      'Shopping Amount',
      'Salar Coins',
      'Royalty Credits',
      'Salar Gift Credits',
      'Funds'
    ],
    required: true 
  })
  type: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, required: true })
  transactionNo: string;
}

export const CreditDebitSchema = SchemaFactory.createForClass(CreditDebit); 