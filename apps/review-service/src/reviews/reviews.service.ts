import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseResponseDto } from '@app/dto';
import { Pool, PoolClient } from 'pg';
import {
  createReviews,
  getProductById,
  getReviewsById,
  // getReviews,
  getReviewsWithFilters,
  ICreateReviewsResult,
  IGetProductByIdResult,
  IGetReviewsByIdResult,
  IGetReviewsResult,
  IGetReviewsWithFiltersParams,
  updateReview,
} from './queries/reviews.queries';
import { HelperService } from '@app/helper';
import { CreateReviewDto } from './dto/create-review.dto';
import { v4 as uuidv4 } from 'uuid';
import { GetReviewDto } from './dto/get-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  private connClient: PoolClient;

  constructor(
    @Inject('DB_CONNECTION') private conn: Pool,
    private helper: HelperService,
  ) {
    this.conn.connect().then((client: PoolClient) => {
      this.connClient = client;
    });
  }

  async getReviews(getReviewDto: GetReviewDto): Promise<BaseResponseDto> {
    try {
      const { productId, rating, userId } = getReviewDto;

      const reviews: IGetReviewsResult[] = await getReviewsWithFilters.run(
        {
          userId,
          productId,
          rating,
        },
        this.conn,
      );

      return this.helper.transformToResponse(reviews, 200);
    } catch (e) {
      console.log(e);
      throw new HttpException(
        {
          message: 'Internal server error',
          details: e.message,
        },
        500,
      );
    }
  }

  async createReview(
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<BaseResponseDto> {
    try {
      const { productId, rating, comment } = createReviewDto;

      const product: IGetProductByIdResult[] = await getProductById.run(
        {
          id: productId,
        },
        this.connClient,
      );

      if (!product.length) {
        throw new NotFoundException('Product not found');
      }

      const newReview: ICreateReviewsResult[] = await createReviews.run(
        {
          comment,
          productId,
          rating,
          userId,
          id: uuidv4(),
        },
        this.conn,
      );

      return this.helper.transformToResponse(newReview, 201);
    } catch (e) {
      throw new HttpException(
        {
          message: 'Error creating review',
          details: e.message,
        },
        e.status,
      );
    }
  }

  async updateReview(
    updateReviewDto: UpdateReviewDto,
    reviewId: string,
    userId: string,
  ): Promise<BaseResponseDto> {
    try {
      const { comment, rating } = updateReviewDto;

      const review: IGetReviewsByIdResult[] = await getReviewsById.run(
        {
          id: reviewId,
        },
        this.conn,
      );

      console.log(review);

      if (!review[0]) {
        throw new NotFoundException('Review not found');
      }

      console.log(review[0].userId, userId);
      if (review[0].userId !== userId) {
        throw new UnauthorizedException(
          'You are not authorized to update this review',
        );
      }

      const updatedReview: ICreateReviewsResult[] = await updateReview.run(
        {
          comment,
          rating,
          id: reviewId,
        },
        this.conn,
      );

      return this.helper.transformToResponse(updatedReview[0], 200);
    } catch (e) {
      console.log(e);
      throw new HttpException(
        {
          message: 'Error updating review',
          details: e.message,
        },
        e.status || 500,
      );
    }
  }
}
