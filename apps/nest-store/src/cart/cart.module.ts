import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from '../products/products.module';
import { HelperModule } from '@app/helper';
import { CartSchema } from '@app/mongo';

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
