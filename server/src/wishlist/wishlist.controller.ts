import { Controller, Post, Delete, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('wishlist')
export class WishlistController {
  constructor(private wishlist: WishlistService) {}

  @Post() add(@Req() req: any, @Body('carId') carId: string) { return this.wishlist.add(req.user.userId, carId); }
  @Delete(':carId') remove(@Req() req: any, @Param('carId') carId: string) { return this.wishlist.remove(req.user.userId, carId); }
  @Get() list(@Req() req: any) { return this.wishlist.list(req.user.userId); }
}