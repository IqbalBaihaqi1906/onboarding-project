import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { CreateProductDto } from './dto/create-product.dto';
import { v4 as uuidv4 } from 'uuid';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HelperService } from '@app/helper';
import { ElasticService } from '@app/elastic';
import { BaseResponseDto } from '@app/dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('DB_CONNECTION') private conn: Pool,
    private helper: HelperService,
    private elasticService: ElasticService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<BaseResponseDto> {
    try {
      const { name, price, description, stock } = createProductDto;

      const result: QueryResult<any> = await this.conn.query(
        'INSERT INTO products (name, price, description, stock, id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, price, description, stock, uuidv4()],
      );

      await this.elasticService.indexProduct(result.rows[0]);

      const response: BaseResponseDto = this.helper.transformToResponse(
        result.rows[0],
        201,
      );

      return response;
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async search(searchDto: GetProductsDto): Promise<BaseResponseDto> {
    try {
      const result: any = await this.elasticService.searchProduct(searchDto);

      const products = result.hits.hits.map((product: any) => product._source);

      const response: BaseResponseDto =
        this.helper.transformToPaginatedResponse(
          products,
          result.hits.total.value,
          searchDto.page,
          searchDto.limit,
        );

      return response;
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async getProducts(getProductDto: GetProductsDto): Promise<BaseResponseDto> {
    try {
      const {
        limit = 10,
        page = 1,
        priceFrom,
        priceTo,
        search,
      } = getProductDto;

      const offset: number = (page - 1) * limit;

      let query: string = 'SELECT * FROM products WHERE 1 = 1';
      const params: any[] = [];

      if (priceFrom) {
        params.push(priceFrom);
        query += ` AND price >= $${params.length}`;
      }

      if (priceTo) {
        params.push(priceTo);
        query += ` AND price <= $${params.length}`;
      }

      if (search) {
        params.push(`%${search}%`);
        query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
      }

      const countQuery: string = query.replace('*', 'COUNT(*)');

      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const [result, count]: [QueryResult<any>, QueryResult<any>] =
        await Promise.all([
          this.conn.query(query, params),
          this.conn.query(countQuery, params.slice(0, params.length - 2)), // Remove limit and offset
        ]);

      const response: BaseResponseDto =
        this.helper.transformToPaginatedResponse(
          result.rows,
          count.rows[0].count,
          page,
          limit,
        );

      return response;
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async checkProduct(id: string): Promise<void> {
    try {
      const result: QueryResult<any> = await this.conn.query(
        'SELECT * FROM products WHERE id = $1',
        [id],
      );

      if (!result.rows.length) {
        throw new HttpException('Product not found', 404);
      }
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async updateProduct(
    updateProductDto: Partial<UpdateProductDto>,
    id: string,
  ): Promise<BaseResponseDto> {
    try {
      await this.checkProduct(id);

      const { query, params } = this.helper.prepareUpdate(
        updateProductDto,
        'PRODUCTS',
        id,
      );

      const result: QueryResult<any> = await this.conn.query(query, params);

      await this.elasticService.updateProduct(result.rows[0]);

      const response: BaseResponseDto = this.helper.transformToResponse(
        result.rows[0],
        200,
      );

      return response;
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async deleteProduct(id: string): Promise<BaseResponseDto> {
    try {
      await this.checkProduct(id);

      const result: QueryResult<any> = await this.conn.query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id],
      );

      const response: BaseResponseDto = this.helper.transformToResponse(
        result.rows[0],
        200,
      );

      await this.elasticService.deleteProduct(id);

      return response;
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async getProductById(id: string): Promise<BaseResponseDto> {
    try {
      const result: QueryResult<any> = await this.conn.query(
        'SELECT * FROM products WHERE id = $1',
        [id],
      );

      if (!result.rows.length) {
        throw new HttpException('Product not found', 404);
      }

      const response: BaseResponseDto = this.helper.transformToResponse(
        result.rows[0],
        200,
      );

      return response;
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async getOneById(id: string): Promise<QueryResult<any>> {
    try {
      const { rows }: QueryResult<any> = await this.conn.query(
        'SELECT * FROM products WHERE id = $1',
        [id],
      );

      if (!rows.length) {
        throw new HttpException('Product not found', 404);
      }

      return rows[0];
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }
}
