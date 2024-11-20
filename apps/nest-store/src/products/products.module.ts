import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { HelperModule } from '../common/helper/helper.module';
import { ElasticModule } from '../libs/elastic/elastic.module';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule, HelperModule, ElasticModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
