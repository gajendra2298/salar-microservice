import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  referralComm: number;

  @Prop({ type: Number, default: 0 })
  sponsorComm: number;

  @Prop({ type: Number, default: 0 })
  ausComm: number;

  @Prop({ type: Number, default: 0 })
  productTeamReferralCommission: number;

  @Prop({ type: Number, default: 0 })
  novaReferralCommission: number;

  @Prop({ type: Number, default: 0 })
  royaltyReferralTeamCommission: number;

  @Prop({ type: Number, default: 0 })
  shoppingAmount: number;

  @Prop({ type: Number, default: 0 })
  salarCoins: number;

  @Prop({ type: Number, default: 0 })
  royaltyCredits: number;

  @Prop({ type: Number, default: 0 })
  salarGiftCredits: number;

  @Prop({ type: Number, default: 0 })
  funds: number;

  @Prop({ type: Number, default: 0 })
  availableBalance: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet); 