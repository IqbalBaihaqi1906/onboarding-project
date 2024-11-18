import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { HelperService } from '../common/helper/helper.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';

@Injectable()
export class AuctionService {
  constructor(
    @Inject('DB_CONNECTION') private conn: Pool,
    private helper: HelperService,
  ) {}

  async createAuction(args: CreateAuctionDto): Promise<BaseResponseDto> {
    try {
      const { productId } = args;

      const { rows: products } = await this.conn.query(
        `SELECT *
         FROM products
         WHERE id = $1`,
        [productId],
      );

      if (products.length === 0) {
        throw new NotFoundException('Product not found');
      }

      const { rows: checkAuction } = await this.conn.query(
        `SELECT *
         FROM auctions
         WHERE "productId" = $1
           AND status = 'ONGOING'`,
        [productId],
      );

      if (checkAuction.length > 0) {
        throw new HttpException('Auction already exists for this product', 400);
      }

      const { rows: newAuction } = await this.conn.query(
        `INSERT INTO auctions ("productId", id)
         VALUES ($1, $2) RETURNING *`,
        [productId, uuidv4()],
      );

      return this.helper.transformToResponse(newAuction[0], 201);
    } catch (e) {
      throw new HttpException(
        e.message || 'Error when creating auction',
        e.status || 500,
      );
    }
  }

  async startAuction(auctionId: string): Promise<BaseResponseDto> {
    try {
      const { rows: auction } = await this.conn.query(
        `SELECT *
         FROM auctions
         WHERE id = $1`,
        [auctionId],
      );

      if (auction.length === 0) {
        throw new NotFoundException('Auction not found');
      }

      if (auction[0].status === 'ONGOING') {
        throw new HttpException('Auction is already ongoing', 400);
      }

      await this.conn.query(
        `UPDATE auctions
         SET status = 'ONGOING'
         WHERE id = $1`,
        [auctionId],
      );

      return this.helper.transformToResponse(
        { message: 'Auction started' },
        200,
      );
    } catch (e) {
      throw new HttpException(
        e.message || 'Error when starting auction',
        e.status || 500,
      );
    }
  }

  async placeBid(auctionId: string, userId: string, amount: number) {
    try {
      const { rows: auction } = await this.conn.query(
        `SELECT *
         FROM auctions
         WHERE id = $1`,
        [auctionId],
      );

      if (auction.length === 0) {
        throw new NotFoundException('Auction not found');
      }

      if (auction[0].status !== 'ONGOING') {
        throw new HttpException('Auction is not ongoing', 400);
      }

      if (auction[0].highestBid >= amount) {
        throw new HttpException(
          'Bid must be higher than current highest bid',
          400,
        );
      }

      const { rows: user } = await this.conn.query(
        `SELECT *
         FROM users
         WHERE id = $1`,
        [userId],
      );

      await this.conn.query(
        `UPDATE auctions
         SET "highestBid" = $1,
             "userId"     = $2`,
        [amount, userId],
      );

      return {
        message: `User ${user[0].username} placed bid successfully`,
      };
    } catch (e) {
      throw new HttpException(
        e.message || 'Error when placing bid',
        e.status || 500,
      );
    }
  }

  async getAuctionById(auctionId: string): Promise<QueryResult<any>> {
    try {
      const { rows: auction } = await this.conn.query(
        `SELECT *
         FROM auctions
         WHERE id = $1`,
        [auctionId],
      );

      if (auction.length === 0) {
        throw new NotFoundException('Auction not found');
      }

      return auction[0];
    } catch (e) {
      throw new HttpException(
        e.message || 'Error when getting auction',
        e.status || 500,
      );
    }
  }
}
