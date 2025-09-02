import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Wishlist extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) user: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Car', required: true, index: true }) car: Types.ObjectId;
}
export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
WishlistSchema.index({ user: 1, car: 1 }, { unique: true });