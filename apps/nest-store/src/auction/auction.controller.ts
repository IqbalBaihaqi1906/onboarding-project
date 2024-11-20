import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { BaseResponseDto } from '@app/dto';
import { Public } from '@app/decorators';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Public()
  @Post('/')
  async createAuction(
    @Body() createAuctionDto: CreateAuctionDto,
  ): Promise<BaseResponseDto> {
    return this.auctionService.createAuction(createAuctionDto);
  }

  @Public()
  @Post('/:id/start')
  async startAuction(@Param('id') id: string): Promise<BaseResponseDto> {
    return this.auctionService.startAuction(id);
  }
}
