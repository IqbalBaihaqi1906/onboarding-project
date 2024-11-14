import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsDto {
  @IsNotEmpty()
  @IsNumber()
  @Type((): NumberConstructor => Number)
  limit: number = 10;

  @IsNotEmpty()
  @IsNumber()
  @Type((): NumberConstructor => Number)
  page: number = 1;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsNumber()
  @Type((): NumberConstructor => Number)
  priceFrom: number;

  @IsOptional()
  @IsNumber()
  @Type((): NumberConstructor => Number)
  priceTo: number;
}
