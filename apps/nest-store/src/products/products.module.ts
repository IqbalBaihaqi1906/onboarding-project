import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from '@app/database';
import { ElasticModule } from '@app/elastic';
import { HelperModule } from '@app/helper';

@Module({
  imports: [DatabaseModule, HelperModule, ElasticModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
