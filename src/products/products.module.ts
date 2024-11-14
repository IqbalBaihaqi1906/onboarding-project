import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DbModule } from '../common/database-connection/database.module';
import { HelperModule } from '../common/helper/helper.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../common/guards/auth.guard';

@Module({
  imports: [DbModule, HelperModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
