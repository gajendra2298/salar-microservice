import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamLevelsDocument = TeamLevels & Document;

@Schema({ timestamps: true })
export class TeamLevels {
  @Prop({ type: Number })
  width: number;

  @Prop({ type: Number })
  depth: number;

  @Prop({ type: Number })
  ULDownline: number;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, default: true })
  status: boolean;
}

export const TeamLevelsSchema = SchemaFactory.createForClass(TeamLevels); 