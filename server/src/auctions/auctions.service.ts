import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auction } from './schemas/auction.schema';
import { Car } from '../cars/schemas/car.schema';
import { Bid } from '../bids/schemas/bid.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(Car.name) private carModel: Model<Car>,
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
  ) {}

  async create(sellerId: string, dto: any) {
    const car = await this.carModel.findById(dto.carId);
    if (!car) throw new NotFoundException('Car not found');
    if (car.owner.toString() !== sellerId)
      throw new ForbiddenException('You do not own this car');

    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (end <= start)
      throw new BadRequestException('End time must be after start time');

    const conflict = await this.auctionModel.findOne({
      car: car._id,
      status: { $in: ['scheduled', 'live'] },
    });
    if (conflict)
      throw new BadRequestException(
        'Active/scheduled auction already exists for this car',
      );

    const status = start <= new Date() ? 'live' : 'scheduled';
    const auction = await this.auctionModel.create({
      car: car._id,
      seller: sellerId,
      status,
      startTime: start,
      endTime: end,
      startingPrice: dto.startingPrice,
      currentPrice: dto.startingPrice,
    });
    return auction.populate({ path: 'car' });
  }

  async getById(id: string) {
    const auction = await this.auctionModel.findById(id).populate([
      { path: 'car', populate: { path: 'owner', select: 'name email' } },
      { path: 'winningBid', populate: { path: 'bidder', select: 'name' } },
    ]);
    if (!auction) throw new NotFoundException('Auction not found');
    return auction;
  }

  async list(q: any) {
    const {
      status,
      make,
      model,
      bodyType,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = q;
    const skip = (Math.max(+page, 1) - 1) * Math.max(+limit, 1);

    const pipeline: any[] = [
      {
        $lookup: {
          from: 'cars',
          localField: 'car',
          foreignField: '_id',
          as: 'car',
        },
      },
      { $unwind: '$car' },
    ];
    if (status) pipeline.push({ $match: { status } });
    if (make) pipeline.push({ $match: { 'car.make': new RegExp(make, 'i') } });
    if (model)
      pipeline.push({ $match: { 'car.model': new RegExp(model, 'i') } });
    if (bodyType) pipeline.push({ $match: { 'car.bodyType': bodyType } });
    if (minPrice || maxPrice)
      pipeline.push({
        $match: {
          'car.price': {
            ...(minPrice ? { $gte: +minPrice } : {}),
            ...(maxPrice ? { $lte: +maxPrice } : {}),
          },
        },
      });
    pipeline.push({ $sort: { createdAt: sort.startsWith('-') ? -1 : 1 } });
    const countPipeline = pipeline.filter(
      (s) => !('$skip' in s) && !('$limit' in s) && !('$sort' in s),
    );
    pipeline.push({ $skip: skip }, { $limit: Math.max(+limit, 1) });

    const [items, countRes] = await Promise.all([
      this.auctionModel.aggregate(pipeline),
      this.auctionModel.aggregate([...countPipeline, { $count: 'total' }]),
    ]);
    const total = countRes[0]?.total || 0;

    return { items, total, page: +page, limit: +limit };
  }

  async listLive() {
    const now = new Date();
    return this.auctionModel
      .find({ status: 'live'})
      .populate('car');
  }

  async related(id: string) {
    const auction = await this.getById(id);
    const car = (auction as any).car;
    return this.auctionModel.aggregate([
      { $match: { _id: { $ne: auction._id } } },
      {
        $lookup: {
          from: 'cars',
          localField: 'car',
          foreignField: '_id',
          as: 'car',
        },
      },
      { $unwind: '$car' },
      { $match: { 'car.bodyType': car.bodyType, status: 'live' } },
      { $limit: 10 },
    ]);
  }

  async update(id: string, sellerId: string, data: any) {
    const auction = await this.auctionModel.findById(id);
    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.seller.toString() !== sellerId)
      throw new ForbiddenException('Not seller');
    if (data.endTime) {
      const end = new Date(data.endTime);
      if (end <= new Date(auction.startTime))
        throw new BadRequestException('Invalid end time');
      auction.endTime = end;
    }
    if (data.status) auction.status = data.status;
    return auction.save();
  }

  async closeAndPickWinner(id: string) {
    const auction = await this.auctionModel.findById(id);
    if (!auction) throw new NotFoundException('Auction not found');
    const topBid = await this.bidModel.findOne({ auction: id }).sort('-amount');
    auction.status = 'ended';
    if (topBid) {
      auction.winningBid = topBid._id as Types.ObjectId;
    }
    return auction.save();
  }
}
