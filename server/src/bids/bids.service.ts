import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid } from './schemas/bid.schema';
import { Auction } from '../auctions/schemas/auction.schema';
import { Car } from '../cars/schemas/car.schema';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(Car.name) private carModel: Model<Car>,
  ) {}

  async placeBid(userId: string, dto: any) {
    const auction = await this.auctionModel.findById(dto.auctionId);
    if (!auction) throw new NotFoundException('Auction not found');
    const now = new Date();
    if (auction.status !== 'live')
      throw new BadRequestException('Auction is not live');

    const car = await this.carModel.findById(auction.car);
    if (!car) throw new NotFoundException('Car not found');
    if (car.owner.toString() === userId)
      throw new ForbiddenException('You cannot bid on your own car');

    if (dto.amount <= auction.currentPrice)
      throw new BadRequestException('Bid must be higher than current price');

    const bid = await this.bidModel.create({ auction: auction._id, bidder: userId, amount: dto.amount });
    auction.currentPrice = dto.amount;
    await auction.save();
    return bid.populate('bidder', 'name');
  }

  listTop(auctionId: string, limit = 10) {
    return this.bidModel.find({ auction: auctionId }).sort('-amount').limit(+limit).populate('bidder', 'name');
  }

  listMyBids(userId: string, page = 1, limit = 20) {
    const skip = (Math.max(+page, 1) - 1) * Math.max(+limit, 1);
    return this.bidModel
      .find({ bidder: userId })
      .sort('-createdAt')
      .skip(skip)
      .limit(+limit)
      .populate({ path: 'auction', populate: { path: 'car' } });
  }
}