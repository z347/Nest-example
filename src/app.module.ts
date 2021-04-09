import { Module } from '@nestjs/common';

import { rootConfigModule } from './configure.root';
import { mongoConfigModule } from './configure.mongo';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [rootConfigModule, mongoConfigModule, UserModule, AuthModule, TokenModule, EmailModule],
})
export class AppModule {}
