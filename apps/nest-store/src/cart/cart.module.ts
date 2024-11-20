import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from '../common/database-connection/mongo/schemas/cart.schema';
import { HelperModule } from '../common/helper/helper.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    HelperModule,
    ProductsModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
