import { IsString, IsNumber, IsIn, IsOptional, IsArray, Min, Max } from 'class-validator';

export class CreateCarDto {
  @IsString() title: string;
  @IsString() make: string;
  @IsString() carModel: string;
  @IsNumber() @Min(1900) @Max(2100) year: number;
  @IsNumber() @Min(0) price: number;
  @IsIn(['sedan','sports','hatchback','convertible','suv','coupe','truck','wagon','van']) bodyType: string;

  @IsOptional() @IsString() vin?: string;
  @IsOptional() @IsString() trim?: string;
  @IsOptional() @IsNumber() mileage?: number;
  @IsOptional() @IsString() engine?: string;
  @IsOptional() @IsString() transmission?: string;
  @IsOptional() @IsString() driveType?: string;
  @IsOptional() @IsString() fuelType?: string;
  @IsOptional() @IsString() exteriorColor?: string;
  @IsOptional() @IsString() interiorColor?: string;
  @IsOptional() @IsNumber() doors?: number;
  @IsOptional() @IsNumber() seats?: number;

  @IsOptional() @IsArray() options?: string[];
  @IsOptional() @IsString() description?: string;

  @IsOptional() @IsString() accidentHistory?: string;
  @IsOptional() @IsString() serviceHistory?: string;
  @IsOptional() @IsString() ownership?: string;
  @IsOptional() @IsString() importStatus?: string;

  @IsOptional() @IsArray() images?: string[];
}

export class UpdateCarDto extends CreateCarDto {}