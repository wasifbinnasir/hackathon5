import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findById(id: string) {
    return this.userModel.findById(id).select('-passwordHash');
  }

  private async patch(id: string, data: Partial<User>) {
    const updated = await this.userModel.findByIdAndUpdate(id, { $set: data }, { new: true }).select('-passwordHash');
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  updatePersonal(id: string, data: Partial<User>) { return this.patch(id, data); }
  updateAddress(id: string, data: Partial<User>) { return this.patch(id, data); }
  updateTraffic(id: string, data: Partial<User>) { return this.patch(id, data); }
  updateProfile(id: string, data: Partial<User>) { return this.patch(id, data); }
}