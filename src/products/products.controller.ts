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
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleUser } from '../common/enums/user.enum';

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

  @Public()
  @Get('/')
  async getProducts(
    @Query() getProductDto: GetProductsDto,
  ): Promise<BaseResponseDto> {
    return this.productsService.getProducts(getProductDto);
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
