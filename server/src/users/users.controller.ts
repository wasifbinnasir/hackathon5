import { Controller, Get, Patch, UseGuards, Body, Req, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePersonalInfoDto, UpdateAddressDto, UpdateTrafficInfoDto } from './dtos/profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from '../cars/schemas/car.schema';
import { Bid } from '../bids/schemas/bid.schema';
import { Wishlist } from '../wishlist/schemas/wishlist.schema';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(
    private users: UsersService,
    @InjectModel(Car.name) private carModel: Model<Car>,
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
    @InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>,
  ) {}

  @Get('me') me(@Req() req: any) { return this.users.findById(req.user.userId); }

  @Patch('me/personal') updatePersonal(@Req() req: any, @Body() body: UpdatePersonalInfoDto) {
    return this.users.updatePersonal(req.user.userId, body);
  }
  @Patch('me/address') updateAddress(@Req() req: any, @Body() body: UpdateAddressDto) {
    return this.users.updateAddress(req.user.userId, body);
  }
  @Patch('me/traffic') updateTraffic(@Req() req: any, @Body() body: UpdateTrafficInfoDto) {
    return this.users.updateTraffic(req.user.userId, body);
  }

  @Get('me/cars') myCars(@Req() req: any) {
    return this.carModel.find({ owner: req.user.userId }).sort('-createdAt');
  }
  @Get('me/bids') myBids(@Req() req: any) {
    return this.bidModel.find({ bidder: req.user.userId })
      .sort('-createdAt')
      .populate({ path: 'auction', populate: { path: 'car' }});
  }
  @Get('me/wishlist') myWishlist(@Req() req: any) {
    return this.wishlistModel.find({ user: req.user.userId }).populate('car').sort('-createdAt');
  }

  @Get('me/profile-summary')
  async profileSummary(@Req() req: any) {
    const userId = req.user.userId;
    const [cars, bids, wishlist] = await Promise.all([
      this.carModel.countDocuments({ owner: userId }),
      this.bidModel.distinct('auction', { bidder: userId }).then(a => a.length),
      this.wishlistModel.countDocuments({ user: userId }),
    ]);
    return { counts: { cars, bids, wishlist } };
  }

  // Public minimal
  @UseGuards() @Get(':id') getPublic(@Param('id') id: string) { return this.users.findById(id); }
}