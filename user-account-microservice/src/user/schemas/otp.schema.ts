import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  mobileNo: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  type: 'EMAIL' | 'SMS';

  @Prop({ default: false })
  isUsed: boolean;

  @Prop({ required: true })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp); 