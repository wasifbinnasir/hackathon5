import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction } from './schemas/auction.schema';

@Injectable()
export class AuctionTasksService {
  private readonly logger = new Logger(AuctionTasksService.name);

  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
  ) {}

  // Every minute, activate scheduled auctions whose startTime has passed
  @Cron(CronExpression.EVERY_MINUTE)
  async activateScheduledAuctions() {
    const now = new Date();
    const res = await this.auctionModel.updateMany(
      { status: 'scheduled', startTime: { $lte: now } },
      { $set: { status: 'live' } },
    );
    if (res.modifiedCount > 0) {
      this.logger.log(`Activated ${res.modifiedCount} scheduled auctions`);
    }
  }

  // Every minute, end live auctions whose endTime has passed
  @Cron(CronExpression.EVERY_MINUTE)
  async closeExpiredAuctions() {
    const now = new Date();
    const res = await this.auctionModel.updateMany(
      { status: 'live', endTime: { $lte: now } },
      { $set: { status: 'ended' } },
    );
    if (res.modifiedCount > 0) {
      this.logger.log(`Closed ${res.modifiedCount} live auctions`);
    }
  }
}
