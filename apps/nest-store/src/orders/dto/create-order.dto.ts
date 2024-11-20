import { IsArray, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  orderItems: OrderItemDto[];
}

export class OrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @Type(() => Number)
  quantity: number;
}
