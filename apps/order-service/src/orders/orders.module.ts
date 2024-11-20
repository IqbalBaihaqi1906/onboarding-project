import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
