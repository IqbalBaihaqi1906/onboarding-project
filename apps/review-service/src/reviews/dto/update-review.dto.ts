import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  comment?: string;

  @IsNumber()
  @IsOptional()
  @Type((): NumberConstructor => Number)
  rating?: number;
}
