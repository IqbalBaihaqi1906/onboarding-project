import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateOrderRequest,
  GetOrderRequest,
  GetUserOrderRequest,
  OrderListResponse,
  OrderResponse,
} from 'libs/interfaces';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @GrpcMethod('OrderService', 'CreateOrder')
  async createOrder(createOrderDto: CreateOrderRequest) {
    return this.ordersService.createOrder({
      orderItems: createOrderDto.orderItems,
      userId: createOrderDto.userId,
    });
  }

  @GrpcMethod('OrderService', 'GetOrder')
  async getOrder(getOrderRequest: GetOrderRequest): Promise<OrderResponse> {
    return this.ordersService.getOrder(getOrderRequest);
  }

  @GrpcMethod('OrderService', 'GetUserOrder')
  async getUserOrder(data: GetUserOrderRequest): Promise<OrderListResponse> {
    return this.ordersService.getUserOrders(data);
  }

  @GrpcMethod('OrderService', 'GetAllOrders')
  async getAllOrder(): Promise<OrderListResponse> {
    return this.ordersService.getOrders({});
  }

  @GrpcMethod('OrderService', 'TestConnection')
  async testConnection(data: {
    message: string;
  }): Promise<{ message: string }> {
    console.log('Received message in microservice:', data);
    const response = await this.ordersService.testConnection(data);
    console.log('Sending response from microservice:', response);
    return response;
  }
}
