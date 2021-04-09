import { MongooseModule } from '@nestjs/mongoose';

export const mongoConfigModule = MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
