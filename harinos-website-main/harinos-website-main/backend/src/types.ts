export type OrderType = 'takeaway' | 'delivery' | 'dinein';

export interface OrderItemPayload {
  id: string;
  name: string;
  quantity: number;
  selectedSize?: string;
  basePrice: number;
  discountedPrice: number;
  totalPrice: number;
  isOfferBonus?: boolean;
  appliedOfferId?: string;
  appliedOfferTitle?: string;
}

export interface OutletPayload {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface CreateOrderRequest {
  orderId: string;
  items: OrderItemPayload[];
  total: number;
  orderType: OrderType;
  deliveryFee: number;
  location: string;
  createdAt: string;
  distanceKm: number | null;
  outlet: OutletPayload;
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'out_for_delivery' | 'done' | 'cancelled';

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loginMethod: 'email' | 'phone';
  verified?: boolean;
  createdAt: string;
}

export interface FullOrderPayload {
  id: string;
  items: unknown[];
  total: number;
  date: string;
  orderType: string;
  deliveryFee?: number;
  outletId?: string;
  outletName?: string;
  outletPhone?: string;
  outletAddress?: string;
  customerLocationUrl?: string;
  distanceKm?: number | null;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  receivedAt?: string;
  status?: OrderStatus;
}
