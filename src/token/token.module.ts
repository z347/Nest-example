import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TokenSchema } from './schemas/user-token.schema';
import { TokenService } from './token.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
