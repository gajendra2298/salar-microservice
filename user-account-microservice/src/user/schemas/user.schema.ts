import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class Address {
  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true })
  addressLine1?: string;

  @Prop({ trim: true })
  addressLine2?: string;

  @Prop({ trim: true })
  city?: string;

  @Prop({ trim: true })
  cityId?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'states' })
  stateId?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'districts' })
  districtId?: string;

  @Prop({ trim: true })
  zipCode?: number;

  @Prop({ trim: true })
  mobileNo?: string;

  @Prop({ trim: true })
  emailId?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Country' })
  countryId?: string;

  @Prop({ trim: true })
  landmark?: string;

  @Prop({ default: false })
  defaultAddress?: boolean;
}

@Schema({ timestamps: true })
export class User {
  @Prop()
  fullName?: string;

  @Prop()
  dob?: string;

  @Prop()
  image?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ enum: ['male', 'female', 'other'] })
  gender?: string;

  @Prop({ required: true })
  emailId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Country' })
  countryId?: string;

  @Prop()
  mobileNo?: string;

  @Prop()
  password?: string;

  @Prop()
  transactionPassword?: string;

  @Prop()
  sponserId?: string;

  @Prop()
  ulDownlineId?: string;

  @Prop()
  level?: number;

  @Prop()
  registerId?: string;

  @Prop()
  otp?: string;

  @Prop({ default: 0 })
  wallet?: number;

  @Prop({ default: 0 })
  freezingAmount?: number;

  @Prop({ default: 0 })
  salarCoins?: number;

  @Prop({ default: 0 })
  shoppingAmount?: number;

  @Prop({ default: 0 })
  sponserCommission?: number;

  @Prop({ default: 0 })
  aurCommission?: number;

  @Prop({ default: 0 })
  gameCommission?: number;

  @Prop({ default: 0 })
  funds?: number;

  @Prop({ default: false })
  termsAndConditions?: boolean;

  @Prop({ default: false })
  isDeleted?: boolean;

  @Prop({ default: true })
  status?: boolean;

  @Prop({ enum: ['regular', 'organisation'] })
  role?: string;

  @Prop({ type: [Address] })
  shippingAddresses?: Address[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'orgdetails', default: null })
  organisationId?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'bankDetails', default: null })
  bankDetails?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'kyc', default: null })
  kycDetails?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'states' })
  stateId?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'districts' })
  districtId?: string;

  @Prop()
  city?: string;

  @Prop()
  zipCode?: string;

  @Prop()
  userAddedDate?: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  userAddedBy?: string;

  @Prop({ default: false })
  salesStatus?: boolean;

  @Prop({ default: false })
  orderProcessingStatus?: boolean;

  @Prop({ default: 'en' })
  preferredLanguage?: string;
}

export const UserSchema = SchemaFactory.createForClass(User); 