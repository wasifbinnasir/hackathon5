import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(@InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>) {}

  async add(userId: string, carId: string) {
    try {
      return await this.wishlistModel.create({ user: userId, car: carId });
    } catch (e: any) {
      if (e.code === 11000) throw new ConflictException('Already in wishlist');
      throw e;
    }
  }
  remove(userId: string, carId: string) { return this.wishlistModel.findOneAndDelete({ user: userId, car: carId }); }
  list(userId: string) {
    return this.wishlistModel.find({ user: userId }).populate({ path: 'car' }).sort('-createdAt');
  }
}