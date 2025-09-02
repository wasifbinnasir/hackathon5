import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Bid extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true }) auction: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) bidder: Types.ObjectId;
  @Prop({ required: true, min: 0 }) amount: number;
}
export const BidSchema = SchemaFactory.createForClass(Bid);
BidSchema.index({ auction: 1, amount: -1 });