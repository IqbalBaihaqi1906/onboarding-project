export interface CreateOrderRequest {
  userId: string;
  orderItems: OrderItemRequest[];
}

export interface OrderItemRequest {
  productId: string;
  price: number;
  quantity: number;
}

export interface OrderResponse {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface GetOrderRequest {
  id: string;
}

export interface GetUserOrderRequest {
  userId: string;
}

export interface OrderListResponse {
  orders: OrderResponse[];
}
