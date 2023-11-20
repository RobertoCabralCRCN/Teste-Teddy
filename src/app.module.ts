import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConnectionService } from './config/database/mongo.connection';
import { ProductsModule } from './products/product.module';
import { ScheduleModule } from '@nestjs/schedule';
// import { Model } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoConnectionService,
    }),
    ProductsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, MongoConnectionService],
})
export class AppModule {}
