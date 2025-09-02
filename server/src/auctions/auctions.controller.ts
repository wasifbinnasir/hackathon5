import { Controller, Post, Get, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateAuctionDto } from './dtos/auction.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(private auctions: AuctionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post() create(@Req() req: any, @Body() dto: CreateAuctionDto) {
    return this.auctions.create(req.user.userId, dto);
  }

  @Get() list(@Query() q: any) { return this.auctions.list(q); }
  @Get('live') live() { return this.auctions.listLive(); }
  @Get(':id') get(@Param('id') id: string) { return this.auctions.getById(id); }
  @Get(':id/related') related(@Param('id') id: string) { return this.auctions.related(id); }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id') update(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.auctions.update(id, req.user.userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/close') close(@Param('id') id: string) {
    return this.auctions.closeAndPickWinner(id);
  }
}