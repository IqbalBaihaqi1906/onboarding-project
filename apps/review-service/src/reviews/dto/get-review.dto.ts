import { IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class GetReviewDto {
  @IsOptional()
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsNumber()
  @Type((): NumberConstructor => Number)
  rating: number;
}
