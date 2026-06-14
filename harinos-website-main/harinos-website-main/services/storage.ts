
import { AdminSession, CustomerProfile, Order } from '../types';
import { safeStorage } from './browserSupport';

const KEYS = {
  ORDERS: 'harinos_past_orders',
  PENDING_ORDERS: 'harinos_pending_orders',
  ADMIN_SESSION: 'harinos_admin_session',
  CUSTOMER_PROFILE: 'harinos_customer_profile',
  VERIFIED_CUSTOMERS: 'harinos_verified_customers',
  FCM_TOKEN: 'harinos_fcm_token',
};

const readJson = <T,>(key: string, fallback: T): T => {
  const saved = safeStorage.getItem(window.localStorage, key);
  if (!saved) return fallback;
  try {
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown): void => {
  safeStorage.setItem(window.localStorage, key, JSON.stringify(value));
};

export const StorageService = {
  getPastOrders: (): Order[] => {
    const saved = safeStorage.getItem(window.localStorage, KEYS.ORDERS);
    try {
      return saved ? JSON.parse(saved).slice(0, 3) : [];
    } catch {
      return [];
    }
  },
  saveOrder: (order: Order) => {
    const orders = StorageService.getPastOrders();
    const updatedOrders = [order, ...orders].slice(0, 3);
    safeStorage.setItem(window.localStorage, KEYS.ORDERS, JSON.stringify(updatedOrders));
  },
  queuePendingOrderSync: (order: Order): void => {
    const pendingOrders = StorageService.getPendingOrderSyncQueue().filter((pendingOrder) => pendingOrder.id !== order.id);
    writeJson(KEYS.PENDING_ORDERS, [order, ...pendingOrders].slice(0, 25));
  },
  getPendingOrderSyncQueue: (): Order[] => readJson<Order[]>(KEYS.PENDING_ORDERS, []),
  removePendingOrderSync: (orderId: string): void => {
    writeJson(
      KEYS.PENDING_ORDERS,
      StorageService.getPendingOrderSyncQueue().filter((order) => order.id !== orderId),
    );
  },
  saveAdminSession: (session: AdminSession): void => writeJson(KEYS.ADMIN_SESSION, session),
  getAdminSession: (): AdminSession | null => readJson<AdminSession | null>(KEYS.ADMIN_SESSION, null),
  clearAdminSession: (): void => {
    safeStorage.removeItem(window.localStorage, KEYS.ADMIN_SESSION);
  },
  updateSessionActivity: (): void => {
    const session = StorageService.getAdminSession();
    if (!session) return;
    StorageService.saveAdminSession({ ...session, lastActivityTime: new Date().toISOString() });
  },
  saveCustomerProfile: (profile: CustomerProfile): void => writeJson(KEYS.CUSTOMER_PROFILE, profile),
  getCustomerProfile: (): CustomerProfile | null => readJson<CustomerProfile | null>(KEYS.CUSTOMER_PROFILE, null),
  getVerifiedCustomers: (): Record<string, boolean> => readJson<Record<string, boolean>>(KEYS.VERIFIED_CUSTOMERS, {}),
  markCustomerVerified: (customerId: string): void => {
    const verified = StorageService.getVerifiedCustomers();
    verified[customerId] = true;
    writeJson(KEYS.VERIFIED_CUSTOMERS, verified);
  },
  saveFCMToken: (token: string): void => {
    safeStorage.setItem(window.localStorage, KEYS.FCM_TOKEN, token);
  },
  getFCMToken: (): string | null => {
    return safeStorage.getItem(window.localStorage, KEYS.FCM_TOKEN);
  },
  clearFCMToken: (): void => {
    safeStorage.removeItem(window.localStorage, KEYS.FCM_TOKEN);
  },
};
