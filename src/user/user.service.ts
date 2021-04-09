import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly saltRounds: number = 12;

  constructor(@InjectModel('User') private readonly UserModel: Model<IUser>) {}

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      return error.message;
    }
  }

  async create(createUserDto: CreateUserDto, roles: string[]): Promise<IUser> {
    try {
      const hash = await this.hashPassword(createUserDto.password);
      const createdUser = new this.UserModel(_.assignIn(createUserDto, { password: hash, roles }));
      return await createdUser.save();
    } catch (error) {
      return error.message;
    }
  }

  async find(id: string): Promise<IUser> {
    try {
      return await this.UserModel.findById(id).exec();
    } catch (error) {
      return error.message;
    }
  }

  async findByEmail(email: string): Promise<IUser> {
    try {
      return await this.UserModel.findOne({ email }).exec();
    } catch (error) {
      return error.message;
    }
  }

  async update(id: string, payload: Partial<IUser>) {
    try {
      return this.UserModel.findByIdAndUpdate({ _id: id }, payload);
    } catch (error) {
      return error.message;
    }
  }
}
