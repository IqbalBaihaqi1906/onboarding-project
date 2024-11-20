import {
  HttpException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Pool } from 'pg';
import { HelperService } from '../common/helper/helper.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrderServiceProto } from './interfaces/order-service.proto';
import { firstValueFrom } from 'rxjs';
import {
  CreateOrderRequest,
  OrderListResponse,
  OrderResponse,
} from 'libs/interfaces';
import { GrpcException } from '../common/exceptions/grpc-exception.filter';

@Injectable()
export class OrdersService implements OnModuleInit {
  private orderServiceGrpc: OrderServiceProto;

  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'order',
      protoPath: join(process.cwd(), 'proto', 'order.proto'),
      url: 'localhost:5001',
    },
  })
  private readonly grpcClient: ClientGrpc;

  onModuleInit() {
    this.orderServiceGrpc =
      this.grpcClient.getService<OrderServiceProto>('OrderService');
  }

  constructor(
    @Inject('DB_CONNECTION') private readonly conn: Pool,
    private helper: HelperService,
  ) {}

  async testConnection() {
    try {
      const message = { message: 'Hello from NestJS' };
      console.log('Sending message to OrderService:', message);

      // Use proper typing for the message
      const result = await firstValueFrom(
        this.orderServiceGrpc.testConnection({ message: message.message }),
      );

      console.log('Received response:', result);
      return result;
    } catch (e) {
      console.error('gRPC Error:', e);
      throw new HttpException('Internal server error', 500);
    }
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: string,
  ): Promise<BaseResponseDto> {
    try {
      const createOrderRequest: CreateOrderRequest = {
        userId,
        orderItems: createOrderDto.orderItems,
      };

      const result: OrderResponse = await firstValueFrom(
        this.orderServiceGrpc.createOrder(createOrderRequest),
      );

      return this.helper.transformToResponse(result, 201);
    } catch (e) {
      console.log(e);
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async getOrder(orderId: string): Promise<BaseResponseDto> {
    try {
      const result: OrderResponse = await firstValueFrom(
        this.orderServiceGrpc.getOrder({ id: orderId }),
      );

      return this.helper.transformToResponse(result, 200);
    } catch (e) {
      console.log(e);
      if (e.code) {
        throw new GrpcException(e);
      }

      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async getOrders({}): Promise<BaseResponseDto> {
    try {
      const result: OrderListResponse = await firstValueFrom(
        this.orderServiceGrpc.getAllOrders({}),
      );

      return this.helper.transformToResponse(result, 200);
    } catch (e) {
      console.error(e);

      if (e.code) {
        throw new GrpcException(e);
      }

      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async getUserOrders(userId: string): Promise<BaseResponseDto> {
    try {
      const result: OrderListResponse = await firstValueFrom(
        this.orderServiceGrpc.getUserOrder({ userId }),
      );

      return this.helper.transformToResponse(result, 200);
    } catch (e) {
      console.error(e);

      if (e.code) {
        throw new GrpcException(e);
      }

      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }
}
