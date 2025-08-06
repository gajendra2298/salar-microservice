import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeamMemberDocument = TeamMember & Document;

@Schema({ timestamps: true })
export class TeamMember {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  registerId: string;

  @Prop({ type: String, required: true })
  sponsorId: string;

  @Prop({ type: String, required: true })
  ulDownlineId: string;

  @Prop({ type: Number, required: true, default: 1 })
  level: number;

  @Prop({ type: Number, required: true, default: 0 })
  position: number;

  @Prop({ type: Types.ObjectId, ref: 'TeamMember' })
  parentId: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: Date, default: Date.now })
  joinedAt: Date;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember); 