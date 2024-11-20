import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from './cart/cart.module';
import { NewsModule } from './news/news.module';
import { AuctionModule } from './auction/auction.module';
import { OrdersModule } from './orders/orders.module';
import { ElasticModule } from '@app/elastic';
import { HelperModule } from '@app/helper';
import { RedisModule } from '@app/redis';

@Module({
  imports: [
    AuthModule,
    HelperModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    ElasticModule,
    RedisModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    CartModule,
    NewsModule,
    AuctionModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
