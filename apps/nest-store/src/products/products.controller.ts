import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseResponseDto } from '@app/dto';
import { RoleUser } from '@app/enums';
import { Public, Roles } from '@app/decorators';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(RoleUser.ADMIN)
  @Post('/')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<BaseResponseDto> {
    return this.productsService.createProduct(createProductDto);
  }

  @Roles(RoleUser.CUSTOMER)
  @Get('/')
  async getProducts(
    @Query() getProductDto: GetProductsDto,
  ): Promise<BaseResponseDto> {
    return this.productsService.getProducts(getProductDto);
  }

  @Public()
  @Get('/search/all')
  async searchProducts(
    @Query() searchDto: GetProductsDto,
  ): Promise<BaseResponseDto> {
    return this.productsService.search(searchDto);
  }

  @Public()
  @Get('/:id')
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto> {
    return this.productsService.getProductById(id);
  }

  @Patch('/:id')
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto> {
    return this.productsService.updateProduct(updateProductDto, id);
  }

  @Delete('/:id')
  async deleteProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto> {
    return this.productsService.deleteProduct(id);
  }
}
