import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Public, Roles } from '@app/decorators';
import { AuthenticatedUser, BaseResponseDto } from '@app/dto';
import { RoleUser } from '@app/enums';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewDto } from './dto/get-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get('/')
  async getReviews(
    @Query() getReviewDto: GetReviewDto,
  ): Promise<BaseResponseDto> {
    return await this.reviewsService.getReviews(getReviewDto);
  }

  @Roles(RoleUser.CUSTOMER)
  @Post('/')
  async createReviews(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: AuthenticatedUser,
  ): Promise<BaseResponseDto> {
    return await this.reviewsService.createReview(createReviewDto, req.user.id);
  }

  @Roles(RoleUser.CUSTOMER)
  @Patch('/:id')
  async updateReview(
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto> {
    return await this.reviewsService.updateReview(
      updateReviewDto,
      id,
      req.user.id,
    );
  }
}
