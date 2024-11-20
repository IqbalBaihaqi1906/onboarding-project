import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthenticatedUser, BaseResponseDto } from '@app/dto';
import { RoleUser } from '@app/enums';
import { Public, Roles } from '@app/decorators';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(RoleUser.CUSTOMER)
  @Post()
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: AuthenticatedUser,
  ): Promise<BaseResponseDto> {
    return this.ordersService.createOrder(createOrderDto, req.user.id);
  }

  @Roles(RoleUser.CUSTOMER)
  @Get('/user/user-orders')
  getUserOrders(@Req() req: AuthenticatedUser): Promise<BaseResponseDto> {
    // console.log('User ID:', req.user.id);
    return this.ordersService.getUserOrders(req.user.id);
  }

  @Roles(RoleUser.CUSTOMER)
  @Get('/:id')
  getOrder(@Param('id') id: string): Promise<BaseResponseDto> {
    // console.log('Order ID:', id);
    return this.ordersService.getOrder(id);
  }

  @Roles(RoleUser.ADMIN)
  @Get('/')
  getOrders(): Promise<BaseResponseDto> {
    return this.ordersService.getOrders({});
  }

  @Public()
  @Get('/test-grpc/connection')
  testConnection() {
    return this.ordersService.testConnection();
  }
}
