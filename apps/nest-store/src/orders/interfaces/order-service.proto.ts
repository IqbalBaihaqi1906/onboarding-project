import { CreateOrderDto } from '../dto/create-order.dto';
import { Observable } from 'rxjs';
import {
  GetOrderRequest,
  GetUserOrderRequest,
  OrderListResponse,
  OrderResponse,
} from 'libs/interfaces';

export interface OrderServiceProto {
  createOrder(data: CreateOrderDto): Observable<OrderResponse>;

  getOrder(data: GetOrderRequest): Observable<OrderResponse>;

  getUserOrder(data: GetUserOrderRequest): Observable<OrderListResponse>;

  getAllOrders({}): Observable<OrderListResponse>;

  testConnection(data: { message: string }): Observable<{ message: string }>;
}
