import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwt: JwtService) {}

 async register(dto: RegisterDto) {
  const existingEmail = await this.userModel.findOne({ email: dto.email });
  if (existingEmail) throw new BadRequestException('Email already registered');

  const existingUsername = await this.userModel.findOne({ username: dto.username });
  if (existingUsername) throw new BadRequestException('Username already taken');

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const user = await this.userModel.create({
   name: dto.name,
    email: dto.email,
    username: dto.username,
    mobileNumber: dto.mobileNumber,
    passwordHash,
  });

  return this.issue(user);
}


  async login(dto: LoginDto) {
    const user: any = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issue(user);
  }

  private async issue(user: any) {
    const payload = { sub: user._id.toString(), email: user.email, username: user.username, roles: user.roles };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    return { accessToken, user: { id: user._id, name: user.name, email: user.email, username: user.username, roles: user.roles } };
  }
}