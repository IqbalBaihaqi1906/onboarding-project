import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @Type((): NumberConstructor => Number)
  price: number;

  @IsOptional()
  @IsNumber()
  @Type((): NumberConstructor => Number)
  stock: number;
}
