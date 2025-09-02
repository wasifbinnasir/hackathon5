import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User extends Document {
  
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  username: string;
  @Prop({ required: true, unique: true, lowercase: true, trim: true }) email: string;
  @Prop({ required: true }) passwordHash: string;

  // Profile fields
  @Prop() avatarUrl?: string;
  @Prop() mobileNumber?: string;
  @Prop() nationality?: string;

  @Prop() idType?: string;
  @Prop() idNumber?: string;

  @Prop() country?: string;
  @Prop() state?: string;
  @Prop() city?: string;
  @Prop() address1?: string;
  @Prop() address2?: string;
  @Prop() landLineNumber?: string;
  @Prop() poBox?: string;
  @Prop() zipCode?: string;

  // Traffic/Driver info
  @Prop() trafficInformationType?: string;
  @Prop() trafficFileNumber?: string;
  @Prop() plateNumber?: string;
  @Prop() plateState?: string;
  @Prop() driverLicenseNumber?: string;
  @Prop() issueCity?: string;

  @Prop({ type: [String], default: ['user'] }) roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);