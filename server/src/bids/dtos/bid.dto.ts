import { IsMongoId, IsNumber, Min } from 'class-validator';
export class CreateBidDto {
  @IsMongoId() auctionId: string;
  @IsNumber() @Min(0) amount: number;
}