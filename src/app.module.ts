import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllersModule } from './controllers/controllers.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ControllersModule],
})
export class AppModule {}