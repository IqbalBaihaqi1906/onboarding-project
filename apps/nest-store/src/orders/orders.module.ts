import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from '@app/database';
import { HelperModule } from '@app/helper';

@Module({
  imports: [DatabaseModule, HelperModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
