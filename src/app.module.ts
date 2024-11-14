import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './common/database-connection/database.module';
import { HelperModule } from './common/helper/helper.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    DbModule,
    HelperModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
