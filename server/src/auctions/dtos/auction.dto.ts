import { IsMongoId, IsDateString, IsNumber, Min } from 'class-validator';
export class CreateAuctionDto {
  @IsMongoId() carId: string;
  @IsDateString() startTime: string;
  @IsDateString() endTime: string;
  @IsNumber() @Min(0) startingPrice: number;
}