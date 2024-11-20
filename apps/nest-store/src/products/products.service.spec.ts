import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { HelperService } from '../common/helper/helper.service';
import { Pool } from 'pg';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let helperService: HelperService;
  let pool: Pool;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        HelperService,
        {
          provide: 'DB_CONNECTION',
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    helperService = module.get<HelperService>(HelperService);
    pool = module.get<Pool>('DB_CONNECTION');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        stock: 10,
      };

      const result = {
        rows: [{ ...createProductDto, id: 'uuid' }],
      };

      jest.spyOn(pool, 'query').mockResolvedValue(result as never);
      jest.spyOn(helperService, 'transformToResponse').mockReturnValue({
        success: true,
        code: 201,
        data: result.rows[0],
        error: null,
        meta: null,
      });

      const response: BaseResponseDto =
        await service.createProduct(createProductDto);

      expect(response).toEqual({
        success: true,
        code: 201,
        data: result.rows[0],
        error: null,
        meta: null,
      });
    });
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const getProductDto = {
        limit: 10,
        page: 1,
        priceFrom: 50,
        priceTo: 150,
        search: 'Test',
      };

      const result = {
        rows: [
          {
            name: 'Test Product',
            price: 100,
            description: 'Test Description',
            stock: 10,
            id: 'uuid',
          },
        ],
      };

      const countResult = {
        rows: [{ count: 1 }],
      };

      jest
        .spyOn(pool, 'query')
        .mockResolvedValueOnce(result as never)
        .mockResolvedValueOnce(countResult as never);
      jest
        .spyOn(helperService, 'transformToPaginatedResponse')
        .mockReturnValue({
          success: true,
          code: 200,
          data: result.rows,
          error: null,
          meta: {
            pagination: {
              total: 1,
              page: 1,
              limit: 10,
            },
          },
        });

      const response: BaseResponseDto =
        await service.getProducts(getProductDto);

      expect(response).toEqual({
        success: true,
        code: 200,
        data: result.rows,
        error: null,
        meta: {
          pagination: {
            total: 1,
            page: 1,
            limit: 10,
          },
        },
      });
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateProductDto: Partial<UpdateProductDto> = {
        name: 'Updated Product',
      };

      const id = 'uuid';

      const result = {
        rows: [{ ...updateProductDto, id }],
      };

      jest.spyOn(service, 'checkProduct').mockResolvedValue();
      jest.spyOn(helperService, 'prepareUpdate').mockReturnValue({
        query: 'UPDATE PRODUCTS SET name = $1 WHERE id = $2 RETURNING *',
        params: ['Updated Product', id],
        updateFields: [['name', 'Updated Product']],
      });
      jest.spyOn(pool, 'query').mockResolvedValue(result as never);
      jest.spyOn(helperService, 'transformToResponse').mockReturnValue({
        success: true,
        code: 200,
        data: result.rows[0],
        error: null,
        meta: null,
      });

      const response: BaseResponseDto = await service.updateProduct(
        updateProductDto,
        id,
      );

      expect(response).toEqual({
        success: true,
        code: 200,
        data: result.rows[0],
        error: null,
        meta: null,
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const id = 'uuid';

      const result = {
        rows: [{ id }],
      };

      jest.spyOn(service, 'checkProduct').mockResolvedValue();
      jest.spyOn(pool, 'query').mockResolvedValue(result as never);
      jest.spyOn(helperService, 'transformToResponse').mockReturnValue({
        success: true,
        code: 200,
        data: result.rows[0],
        error: null,
        meta: null,
      });

      const response: BaseResponseDto = await service.deleteProduct(id);

      expect(response).toEqual({
        success: true,
        code: 200,
        data: result.rows[0],
        error: null,
        meta: null,
      });
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const id = 'uuid';

      const result = {
        rows: [
          {
            name: 'Test Product',
            price: 100,
            description: 'Test Description',
            stock: 10,
            id,
          },
        ],
      };

      jest.spyOn(pool, 'query').mockResolvedValue(result as never);
      jest.spyOn(helperService, 'transformToResponse').mockReturnValue({
        success: true,
        code: 200,
        data: result.rows[0],
        error: null,
        meta: null,
      });

      const response: BaseResponseDto = await service.getProductById(id);

      expect(response).toEqual({
        success: true,
        code: 200,
        data: result.rows[0],
        error: null,
        meta: null,
      });
    });
  });
});
