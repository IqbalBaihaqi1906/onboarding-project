import { HttpException, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  IndicesCreateResponse,
  WriteResponseBase,
} from '@elastic/elasticsearch/lib/api/types';
import { GetProductsDto } from '../../products/dto/get-products.dto';
import { Product } from '../../products/models/product.model';
import { LogTypeEnum } from '../../common/enums/log-type.enum';
import { LogDto } from '../../common/dto/log.dto';

@Injectable()
export class ElasticService {
  private indexes: string[] = ['products', 'users'];
  private logType: LogTypeEnum[] = [
    LogTypeEnum.userActivity,
    LogTypeEnum.productActivity,
  ];

  constructor(private readonly elasticClient: ElasticsearchService) {
    this.initIndexes();
  }

  async ping() {
    return this.elasticClient.ping();
  }

  async indexProduct(data: Product): Promise<WriteResponseBase> {
    return this.elasticClient.index({
      index: this.indexes[0] || 'products',
      document: data,
    });
  }

  async logActivity(data: LogDto) {
    if (this.logType.includes(data.type)) {
      await this.elasticClient.index({
        index: 'app_logs',
        document: data,
      });
    }
  }

  async searchProduct(searchDto: GetProductsDto) {
    interface RangeFilter {
      range: {
        price: {
          gte?: number;
          lte?: number;
        };
      };
    }

    interface SearchQuery {
      bool: {
        must: {
          multi_match?: {
            query: string;
            fields: string[];
          };
          match_all?: object; // berarti tidak ada field yang dicari
        };
        filter: RangeFilter[];
      };
    }

    const query: SearchQuery = {
      bool: {
        must: searchDto.search
          ? {
              multi_match: {
                query: searchDto.search, // berarti harus ada field yang dicari di dalam array fields
                fields: ['name', 'description'],
              },
            }
          : { match_all: {} },
        filter: [], // berarti filter tidak wajib ada
      },
    };

    if (searchDto.priceFrom || searchDto.priceTo) {
      const rangeFilter: RangeFilter = {
        range: {
          price: {},
        },
      };

      if (searchDto.priceFrom) {
        rangeFilter.range.price.gte = searchDto.priceFrom;
      }

      if (searchDto.priceTo) {
        rangeFilter.range.price.gte = searchDto.priceTo;
      }

      query.bool.filter.push(rangeFilter);
    }

    const result = await this.elasticClient.search({
      index: this.indexes[0] || 'products',
      query,
      size: searchDto.limit || 10,
      from: (searchDto.page - 1) * searchDto.limit || 0,
    });

    return result;
  }

  async updateProduct(dataProduct: Product) {
    try {
      // Cari dokumen berdasarkan field id
      const searchResult = await this.searchDocumentById(dataProduct.id);

      if (searchResult.hits.hits.length > 0) {
        // Ambil _id Elasticsearch
        const elasticId = searchResult.hits.hits[0]._id;

        // Update menggunakan _id Elasticsearch
        await this.elasticClient.update({
          index: this.indexes[0] || 'products',
          id: elasticId,
          doc: dataProduct,
        });
      } else {
        console.log('Create new product');
        // Jika dokumen belum ada, buat baru
        await this.elasticClient.index({
          index: this.indexes[0] || 'products',
          document: dataProduct,
        });
      }
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async deleteProduct(id: string) {
    try {
      const document = await this.searchDocumentById(id);

      if (document.hits.hits.length > 0) {
        const elasticId: string = document.hits.hits[0]._id;

        return this.elasticClient.delete({
          index: this.indexes[0] || 'products',
          id: elasticId,
        });
      }
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  private async initIndexes() {
    await this.createProductIndex();
    await this.createUsersIndex();
    await this.createLogIndex();
  }

  private searchDocumentById(id: string) {
    try {
      const document = this.elasticClient.search({
        index: this.indexes[0] || 'products',
        query: {
          match: {
            id,
          },
        },
      });

      return document;
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  private async createUsersIndex(): Promise<IndicesCreateResponse> {
    const exists = await this.elasticClient.indices.exists({
      index: this.indexes[1] || 'users',
    });

    if (!exists) {
      return this.elasticClient.indices.create({
        index: this.indexes[1] || 'users',
        mappings: {
          properties: {
            email: { type: 'text' },
            password: { type: 'text' },
            role: { type: 'text' },
          },
        },
      });
    }
  }

  private async createProductIndex(): Promise<IndicesCreateResponse> {
    const exists = await this.elasticClient.indices.exists({
      index: this.indexes[0] || 'products',
    });

    if (!exists) {
      return this.elasticClient.indices.create({
        index: this.indexes[0] || 'products',
        mappings: {
          properties: {
            name: { type: 'text' },
            price: { type: 'float' },
            description: { type: 'text' },
            stock: { type: 'integer' },
          },
        },
      });
    }
  }

  private async createLogIndex(): Promise<IndicesCreateResponse> {
    const exists = await this.elasticClient.indices.exists({
      index: 'app_logs',
    });

    if (!exists) {
      return this.elasticClient.indices.create({
        index: 'app_logs',
        mappings: {
          properties: {
            type: { type: 'keyword' },
            activity: { type: 'text' },
            timestamp: { type: 'date' },
            method: { type: 'keyword' },
            endpoint: { type: 'text' },
            status: { type: 'keyword' },
          },
        },
      });
    }
  }
}
