import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Car, CarSchema } from '../cars/schemas/car.schema';
import { Bid, BidSchema } from '../bids/schemas/bid.schema';
import { Wishlist, WishlistSchema } from '../wishlist/schemas/wishlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Car.name, schema: CarSchema },
      { name: Bid.name, schema: BidSchema },
      { name: Wishlist.name, schema: WishlistSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}