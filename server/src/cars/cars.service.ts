import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car } from './schemas/car.schema';
import { Model, FilterQuery } from 'mongoose';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<Car>) {}

  create(ownerId: string, data: any) { return this.carModel.create({ ...data, owner: ownerId }); }

  async update(id: string, ownerId: string, data: any) {
    const car = await this.carModel.findById(id);
    if (!car) throw new NotFoundException('Car not found');
    if (car.owner.toString() !== ownerId) throw new ForbiddenException('Not owner');
    Object.assign(car, data);
    return car.save();
  }

  async remove(id: string, ownerId: string) {
    const car = await this.carModel.findById(id);
    if (!car) throw new NotFoundException('Car not found');
    if (car.owner.toString() !== ownerId) throw new ForbiddenException('Not owner');
    await car.deleteOne();
    return { deleted: true };
  }

  async findById(id: string) {
    const car = await this.carModel.findById(id).populate('owner', 'name email');
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  async list(query: any, currentUserId?: string) {
    const {
      search, make, carModel, bodyType, minYear, maxYear, minPrice, maxPrice,
      sort = '-createdAt', page = 1, limit = 12, owner,
    } = query;

    const filter: FilterQuery<Car> = {};
    if (owner === 'me' && currentUserId) filter.owner = currentUserId;
    if (owner && owner !== 'me') filter.owner = owner;

    if (search) filter.$text = { $search: search };
    if (make) filter.make = new RegExp(make, 'i');
    if (carModel) filter.carModel = new RegExp(carModel, 'i');
    if (bodyType) filter.bodyType = bodyType;
    if (minYear || maxYear) filter.year = { ...(minYear && { $gte: +minYear }), ...(maxYear && { $lte: +maxYear }) };
    if (minPrice || maxPrice) filter.price = { ...(minPrice && { $gte: +minPrice }), ...(maxPrice && { $lte: +maxPrice }) };

    const skip = (Math.max(+page, 1) - 1) * Math.max(+limit, 1);
    const [items, total] = await Promise.all([
      this.carModel.find(filter).sort(sort).skip(skip).limit(Math.max(+limit, 1)),
      this.carModel.countDocuments(filter),
    ]);
    return { items, total, page: +page, limit: +limit };
  }
}