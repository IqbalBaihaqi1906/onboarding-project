import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './common/database-connection/postgres/database.module';
import { HelperModule } from './common/helper/helper.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { ElasticModule } from './libs/elastic/elastic.module';
import { RedisModule } from './libs/redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from './cart/cart.module';
import { NewsModule } from './news/news.module';
import { AuctionModule } from './auction/auction.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    AuthModule,
    DbModule,
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
