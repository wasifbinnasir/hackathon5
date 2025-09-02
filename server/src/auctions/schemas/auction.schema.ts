import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type AuctionStatus = 'scheduled' | 'live' | 'ended' | 'completed';

@Schema({ timestamps: true })
export class Auction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Car', required: true }) car: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) seller: Types.ObjectId;
  @Prop({ required: true, enum: ['scheduled','live','ended','completed'], default: 'scheduled' }) status: AuctionStatus;
  @Prop({ required: true }) startTime: Date;
  @Prop({ required: true }) endTime: Date;
  @Prop({ required: true, min: 0 }) startingPrice: number;
  @Prop({ required: true, min: 0 }) currentPrice: number;
  @Prop({ type: Types.ObjectId, ref: 'Bid' }) winningBid?: Types.ObjectId;
}
export const AuctionSchema = SchemaFactory.createForClass(Auction);
AuctionSchema.index({ status: 1, startTime: 1, endTime: 1 });