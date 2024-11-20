import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAuctionDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
