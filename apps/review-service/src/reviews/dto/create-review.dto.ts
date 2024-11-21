import { IsNotEmpty, IsNumber, IsString, IsUUID, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(5)
  @Type((): NumberConstructor => Number)
  rating: number;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
