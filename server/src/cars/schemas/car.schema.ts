import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BodyType =
  | 'sedan' | 'sports' | 'hatchback' | 'convertible' | 'suv' | 'coupe' | 'truck' | 'wagon' | 'van';

@Schema({ timestamps: true })
export class Car extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) owner: Types.ObjectId;

  // Basic
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) make: string;
  @Prop({ required: true }) carModel: string;
  @Prop({ required: true, min: 1900, max: 2100 }) year: number;
  @Prop({ required: true, min: 0 }) price: number;
  @Prop({ required: true, enum: ['sedan','sports','hatchback','convertible','suv','coupe','truck','wagon','van'] })
  bodyType: BodyType;

  // Form-specific
  @Prop() vin?: string;
  @Prop() trim?: string;
  @Prop() mileage?: number;
  @Prop() engine?: string;
  @Prop() transmission?: string;
  @Prop() driveType?: string;
  @Prop() fuelType?: string;
  @Prop() exteriorColor?: string;
  @Prop() interiorColor?: string;
  @Prop() doors?: number;
  @Prop() seats?: number;

  @Prop({ type: [String], default: [] }) options?: string[];
  @Prop({ default: '' }) description: string;

  // Histories
  @Prop() accidentHistory?: string;
  @Prop() serviceHistory?: string;
  @Prop() ownership?: string;
  @Prop() importStatus?: string;

  // Media
  @Prop({ type: [String], default: [] }) images: string[];
}

export const CarSchema = SchemaFactory.createForClass(Car);
CarSchema.index({ make: 1, model: 1, year: 1, price: 1, bodyType: 1 });