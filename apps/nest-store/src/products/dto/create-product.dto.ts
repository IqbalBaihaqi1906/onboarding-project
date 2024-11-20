import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Type((): NumberConstructor => Number)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Type((): NumberConstructor => Number)
  stock: number;
}
