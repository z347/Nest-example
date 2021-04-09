import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUserToken } from './interfaces/user-token.interface';
import { CreateUserTokenDto } from './dto/create-user-token.dto';

@Injectable()
export class TokenService {
  constructor(@InjectModel('Token') private readonly TokenModel: Model<IUserToken>) {}

  async create(createUserTokenDto: CreateUserTokenDto): Promise<IUserToken> {
    const userToken = new this.TokenModel(createUserTokenDto);
    return await userToken.save();
  }

  async delete(userId: string, token: string): Promise<{ ok?: number; n?: number }> {
    return await this.TokenModel.deleteOne({ userId, token });
  }

  async deleteAll(userId: string): Promise<{ ok?: number; n?: number }> {
    return await this.TokenModel.deleteMany({ userId });
  }

  async exists(userId: string, token: string): Promise<boolean> {
    return await this.TokenModel.exists({ userId, token });
  }
}
