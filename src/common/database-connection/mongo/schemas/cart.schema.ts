import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class CartItem {
  @Prop({ required: true, unique: true })
  productId: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: false })
  productName: string;

  @Prop({ default: Date.now })
  addedAt: Date;
}

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, type: [CartItem], default: [] })
  items: CartItem[];

  @Prop({ required: true, default: 0 })
  totalAmount: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
