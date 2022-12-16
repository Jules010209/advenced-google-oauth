import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { application } from '../config.json';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.use(cors({
    origin: `http://localhost:${application.port}`,
    credentials: true,
  }));

  app.use(cookieParser());

  await app.listen(application.port);
}

bootstrap();