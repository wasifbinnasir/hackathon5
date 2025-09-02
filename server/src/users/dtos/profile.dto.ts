import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdatePersonalInfoDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsString() mobileNumber?: string;
  @IsOptional() @IsString() nationality?: string;
  @IsOptional() @IsString() idType?: string;
  @IsOptional() @IsString() idNumber?: string;
}

export class UpdateAddressDto {
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() address1?: string;
  @IsOptional() @IsString() address2?: string;
  @IsOptional() @IsString() landLineNumber?: string;
  @IsOptional() @IsString() poBox?: string;
  @IsOptional() @IsString() zipCode?: string;
}

export class UpdateTrafficInfoDto {
  @IsOptional() @IsString() trafficInformationType?: string;
  @IsOptional() @IsString() trafficFileNumber?: string;
  @IsOptional() @IsString() plateNumber?: string;
  @IsOptional() @IsString() plateState?: string;
  @IsOptional() @IsString() driverLicenseNumber?: string;
  @IsOptional() @IsString() issueCity?: string;
}