import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DbModule } from '../common/database-connection/postgres/database.module';
import { HelperModule } from '../common/helper/helper.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../common/guards/auth.guard';
import { ElasticModule } from '../libs/elastic/elastic.module';

@Module({
  imports: [DbModule, HelperModule, ElasticModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
