import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SponsorTeamDocument = SponsorTeam & Document;

@Schema({ timestamps: true })
export class SponsorTeam {
  @Prop({ type: Types.ObjectId, ref: 'Users' })
  user_id: Types.ObjectId;

  @Prop({ type: String })
  sponsor_id: string;

  @Prop({ type: String })
  doj: string;

  @Prop({ type: String })
  user_name: string;

  @Prop({ type: String })
  email_id: string;

  @Prop({ type: String })
  registerId: string;

  @Prop({ type: String })
  sponsor_name: string;
}

export const SponsorTeamSchema = SchemaFactory.createForClass(SponsorTeam); 