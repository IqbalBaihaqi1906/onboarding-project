import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleUser } from '../common/enums/user.enum';
import { AuthenticatedUser } from '../common/dto/authenticated-user.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(RoleUser.CUSTOMER)
  @Get('/')
  async getCart(@Req() req: AuthenticatedUser) {
    return await this.cartService.getCart(req.user.id);
  }

  @Roles(RoleUser.CUSTOMER)
  @Post('/items')
  async getCartItems(
    @Req() req: AuthenticatedUser,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return await this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Roles(RoleUser.CUSTOMER)
  @Post('/items/quantity/:productId')
  async updateQuantity(
    @Req() req: AuthenticatedUser,
    @Body('quantity') quantity: number,
    @Param('productId') productId: string,
  ): Promise<BaseResponseDto> {
    return await this.cartService.updateCartItemQuantity(
      req.user.id,
      productId,
      quantity,
    );
  }

  @Roles(RoleUser.CUSTOMER)
  @Delete('/items/:productId')
  async removeItem(
    @Req() req: AuthenticatedUser,
    @Param('productId') productId: string,
  ): Promise<BaseResponseDto> {
    return await this.cartService.deleteCartItem(req.user.id, productId);
  }
}
