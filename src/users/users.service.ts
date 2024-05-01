import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserDocument,
  UserEntity,
} from 'src/database/schema/users/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
  ) {}

  findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).lean();
  }

  async create(user: UserEntity): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }
}
