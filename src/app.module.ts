import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './common/database-connection/database.module';
import { HelperModule } from './common/helper/helper.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { ElasticModule } from './libs/elastic/elastic.module';
import { RedisModule } from './libs/redis/redis.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
