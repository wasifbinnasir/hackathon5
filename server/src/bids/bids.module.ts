import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './schemas/bid.schema';
import { Auction, AuctionSchema } from '../auctions/schemas/auction.schema';
import { Car, CarSchema } from '../cars/schemas/car.schema';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: Auction.name, schema: AuctionSchema },
      { name: Car.name, schema: CarSchema },
    ]),
  ],
  providers: [BidsService],
  controllers: [BidsController],
})
export class BidsModule {}