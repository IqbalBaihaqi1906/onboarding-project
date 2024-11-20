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
import { AddToCartDto } from './dto/add-to-cart.dto';
import { AuthenticatedUser, BaseResponseDto } from '@app/dto';
import { RoleUser } from '@app/enums';
import { Roles } from '@app/decorators';

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
