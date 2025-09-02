import { Controller, Post, Body, UseGuards, Req, Get, Query, Param } from '@nestjs/common';
import { BidsService } from './bids.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateBidDto } from './dtos/bid.dto';

@Controller()
export class BidsController {
  constructor(private bids: BidsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('bids') place(@Req() req: any, @Body() dto: CreateBidDto) {
    return this.bids.placeBid(req.user.userId, dto);
  }

  @Get('auctions/:id/bids') top(@Param('id') auctionId: string, @Query('limit') limit?: number) {
    return this.bids.listTop(auctionId, limit ? +limit : 10);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users/me/bids') myBids(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.bids.listMyBids(req.user.userId, page ? +page : 1, limit ? +limit : 20);
  }
}