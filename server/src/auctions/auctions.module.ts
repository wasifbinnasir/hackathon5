import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionSchema } from './schemas/auction.schema';
import { Car, CarSchema } from '../cars/schemas/car.schema';
import { Bid, BidSchema } from '../bids/schemas/bid.schema';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { AuctionTasksService } from './auction-task.service'; // <--- import

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auction.name, schema: AuctionSchema },
      { name: Car.name, schema: CarSchema },
      { name: Bid.name, schema: BidSchema },
    ]),
  ],
  providers: [AuctionsService, AuctionTasksService], // <--- add here
  controllers: [AuctionsController],
  exports: [MongooseModule],
})
export class AuctionsModule {}
