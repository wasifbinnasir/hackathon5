import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Req, Optional } from '@nestjs/common';
import { CarsService } from './cars.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCarDto, UpdateCarDto } from './dtos/car.dto';

@Controller('cars')
export class CarsController {
  constructor(private cars: CarsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post() create(@Req() req: any, @Body() dto: CreateCarDto) {
    return this.cars.create(req.user.userId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id') update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateCarDto) {
    return this.cars.update(id, req.user.userId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id') remove(@Param('id') id: string, @Req() req: any) {
    return this.cars.remove(id, req.user.userId);
  }

  @Get() list(@Query() query: any, @Req() req: any) {
    return this.cars.list(query, req.user?.userId);
  }

  @Get(':id') get(@Param('id') id: string) { return this.cars.findById(id); }
}