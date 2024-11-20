import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Product } from '../products/models/product.model';
import { HelperService } from '@app/helper';
import { BaseResponseDto } from '@app/dto';
import { Cart, CartDocument } from '@app/mongo';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private helper: HelperService,
    private productService: ProductsService,
  ) {}

  async getCart(userId: string): Promise<BaseResponseDto> {
    try {
      const cart: Cart = await this.cartModel.findOne({
        userId,
      });

      if (!cart) {
        const cart: Cart = await this.cartModel.create({
          userId,
          items: [],
        });

        return this.helper.transformToResponse(cart, 200);
      }

      return this.helper.transformToResponse(cart, 200);
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async getCartById(userId: string): Promise<CartDocument> {
    try {
      const cart: CartDocument = await this.cartModel.findOne({
        userId,
      });

      if (!cart) {
        throw new HttpException('Cart not found', 404);
      }

      return cart;
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    try {
      const { productId, quantity } = addToCartDto;

      const { data } = await this.productService.getProductById(productId);

      const product = data as Product;

      if (!product) {
        throw new HttpException('Product not found', 404);
      }

      const cart: CartDocument = await this.getCartById(userId);

      const existItem = cart.items.find((item) => item.productId === productId);

      if (existItem) {
        existItem.quantity += quantity;
      } else {
        cart.items.push({
          productId,
          price: product.price,
          quantity,
          productName: product.name,
          addedAt: new Date(),
        });
      }

      cart.totalAmount = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      await this.cartModel.findByIdAndUpdate(cart._id, cart);

      return this.helper.transformToResponse({ _id: cart._id }, 200);
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async updateCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<BaseResponseDto> {
    try {
      const cart: CartDocument = await this.getCartById(userId);

      const existItem = cart.items.find((item) => item.productId === productId);

      if (!existItem) {
        throw new HttpException('Item not found', 404);
      }

      existItem.quantity = quantity;

      cart.totalAmount = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      await this.cartModel.findByIdAndUpdate(cart._id, cart);

      return this.helper.transformToResponse({ _id: cart._id }, 200);
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async deleteCartItem(
    userId: string,
    productId: string,
  ): Promise<BaseResponseDto> {
    try {
      const cart: CartDocument = await this.getCartById(userId);

      const existItem = cart.items.find((item) => item.productId === productId);

      if (!existItem) {
        throw new HttpException('Item not found', 404);
      }

      cart.items = cart.items.filter((item) => item.productId !== productId);

      cart.totalAmount = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      await this.cartModel.findByIdAndUpdate(cart._id, cart);

      return this.helper.transformToResponse({ _id: cart._id }, 200);
    } catch (e) {
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }
}
