import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Get data from .env file
  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT');
  const host = configService.get<string>('SERVER_HOST');

  // Swagger configuration
  const options = new DocumentBuilder()
    .setTitle('Online shop')
    .setDescription('API for online store')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  // Start the server
  await app
    .listen(port)
    .then(() => {
      Logger.log(`Server is run and available at ${host}:${port}`);
      Logger.log(`Documentation is available at ${host}:${port}/doc`);
    })
    .catch(() => Logger.error("Something went wrong. Server can't be start."));
}

bootstrap();
