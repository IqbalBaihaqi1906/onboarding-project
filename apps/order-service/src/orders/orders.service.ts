import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateOrderRequest,
  GetOrderRequest,
  GetUserOrderRequest,
  GrpcStatusCode,
  OrderListResponse,
  OrderResponse,
} from 'libs/interfaces';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  private client: PoolClient;

  constructor(@Inject('DB_CONNECTION') private readonly conn: Pool) {
    this.conn.connect().then((client: PoolClient) => {
      this.client = client;
    });
  }

  async createOrder(createOrderDto: CreateOrderRequest) {
    try {
      const { orderItems, userId } = createOrderDto;
      await this.client.query('BEGIN');

      const products = await Promise.all([
        ...orderItems.map((item) => this.getProductById(item.productId)),
      ]);

      if (products.some((product) => !product)) {
        throw new HttpException('Product not found', 404);
      }

      const totalAmount = this.calculateTotalAmount(orderItems);

      const { rows: orderResult } = await this.client.query(
        `INSERT INTO orders (id, "userId", status, "totalAmount")
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [uuidv4(), userId, 'PENDING', totalAmount],
      );

      await Promise.all(
        orderItems.map((item) => {
          return this.client.query(
            `INSERT INTO order_items (id, "orderId", "productId", quantity, price)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              uuidv4(),
              orderResult[0].id,
              item.productId,
              item.quantity,
              item.price,
            ],
          );
        }),
      );

      await this.client.query('COMMIT');

      const orderDetail = await this.getOrderDetailById(orderResult[0].id);

      return orderDetail;
    } catch (e) {
      this.client.query('ROLLBACK');
      console.error(e);
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async getOrder(getOrderRequest: GetOrderRequest): Promise<OrderResponse> {
    try {
      const order: OrderResponse = await this.getOrderDetailById(
        getOrderRequest.id,
      );

      return order;
    } catch (e) {
      if (e instanceof RpcException) {
        throw e;
      }

      throw new RpcException({
        code: GrpcStatusCode.INTERNAL,
        message: e.message || 'Internal server error',
      });
    }
  }

  async getUserOrders(
    getUserOrderRequest: GetUserOrderRequest,
  ): Promise<OrderListResponse> {
    try {
      const { rows: orders } = await this.client.query(
        `SELECT *
         FROM orders
         WHERE "userId" = $1`,
        [getUserOrderRequest.userId],
      );

      const orderDetails = await Promise.all(
        orders.map((order) => this.getOrderDetailById(order.id)),
      );

      return { orders: orderDetails };
    } catch (e) {
      if (e instanceof RpcException) {
        throw e;
      }

      throw new RpcException({
        code: GrpcStatusCode.INTERNAL,
        message: e.message || 'Internal server error',
      });
    }
  }

  async getOrders({}: {}): Promise<OrderListResponse> {
    try {
      const { rows: orders } = await this.client.query(
        `SELECT *
         FROM orders LIMIT 10`,
      );

      const orderDetails = await Promise.all(
        orders.map((order) => this.getOrderDetailById(order.id)),
      );

      return { orders: orderDetails };
    } catch (e) {
      if (e instanceof RpcException) {
        throw e;
      }

      throw new RpcException({
        code: GrpcStatusCode.INTERNAL,
        message: e.message || 'Internal server error',
      });
    }
  }

  async getProductById(productId: string): Promise<OrderResponse> {
    try {
      const result = await this.client.query(
        'SELECT * FROM products WHERE id = $1',
        [productId],
      );

      return result.rows[0];
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal server error', 500);
    }
  }

  async testConnection(data: {
    message: string;
  }): Promise<{ message: string }> {
    console.log('Processing message in service:', data);
    return { message: `Microservice received: ${data.message}` };
  }

  calculateTotalAmount(orderItems: any[]): number {
    return orderItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
  }

  async getOrderDetailById(orderId: string): Promise<any> {
    try {
      const [{ rows: orderResult }, { rows: orderItems }] = await Promise.all([
        this.client.query(
          `SELECT *
           FROM orders
           WHERE id = $1`,
          [orderId],
        ),
        this.client.query(
          `SELECT *
           FROM order_items
           WHERE "orderId" = $1`,
          [orderId],
        ),
      ]);

      if (!orderResult.length) {
        throw new RpcException({
          code: GrpcStatusCode.NOT_FOUND,
          message: 'Order not found',
        });
      }

      return {
        id: orderResult[0].id,
        userId: orderResult[0].userId,
        status: orderResult[0].status,
        totalAmount: orderResult[0].totalAmount,
        orderItems,
      };
    } catch (e) {
      if (e instanceof RpcException) {
        throw e;
      }

      throw new RpcException({
        code: GrpcStatusCode.INTERNAL,
        message: e.message || 'Internal server error',
      });
    }
  }
}
