import { CustomerProfile, FullOrderPayload, OrderStatus } from '../types.js';

export interface OrderStore {
  name: string;
  getOrders(): Promise<FullOrderPayload[]>;
  saveOrder(order: FullOrderPayload): Promise<void>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
  getCustomers(): Promise<CustomerProfile[]>;
  saveCustomer(profile: CustomerProfile): Promise<void>;
  verifyCustomer(customerId: string): Promise<CustomerProfile | null>;
}

export const newestOrdersFirst = (orders: FullOrderPayload[]): FullOrderPayload[] =>
  [...orders].sort(
    (a, b) => new Date(b.receivedAt ?? b.date).getTime() - new Date(a.receivedAt ?? a.date).getTime(),
  );
