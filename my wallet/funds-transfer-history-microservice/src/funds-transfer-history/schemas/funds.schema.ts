import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FundsDocument = Funds & Document;

@Schema({ timestamps: true })
export class Funds {
  @Prop({ type: Number, required: true, auto: true })
  serialNo: number;

  @Prop({ type: Date, required: true, default: Date.now })
  transferDate: Date;

  @Prop({ type: String, required: true })
  receiverCustomerRegisteredId: string;

  @Prop({ type: String, required: true })
  customerName: string;

  @Prop({ type: String, required: true, unique: true })
  fundsTransactionNo: string;

  @Prop({ 
    type: String, 
    enum: ['Success', 'Failed'],
    required: true,
    default: 'Success'
  })
  status: string;

  // Additional fields for internal tracking
  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  senderUserId: Types.ObjectId;

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
  commissionType: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Number, default: 0 })
  adminCharges: number;

  @Prop({ type: Number, default: 0 })
  netPayable: number;

  @Prop({ type: String })
  failureReason: string;
}

export const FundsSchema = SchemaFactory.createForClass(Funds);

// Auto-increment serial number
FundsSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastRecord = await (this.constructor as any).findOne({}, {}, { sort: { 'serialNo': -1 } });
    this.serialNo = lastRecord ? lastRecord.serialNo + 1 : 1;
  }
  next();
}); 