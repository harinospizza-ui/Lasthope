import { 
  CustomerProfile, 
  Order, 
  OrderStatus, 
  MenuItem, 
  OutletConfig, 
  OfferCard, 
  WalletTransaction, 
  AppSettings, 
  VerificationRequest,
  AdminSession,
  Category
} from '../types';
import { StorageService } from './storage';
import { OUTLET_LOCATIONS } from '../constants';
import {
  db,
  auth,
  storage,
  FIRESTORE_ORDERS_COLLECTION,
  FIRESTORE_CUSTOMERS_COLLECTION,
  FIRESTORE_MENU_ITEMS_COLLECTION,
  FIRESTORE_OUTLETS_COLLECTION,
  FIRESTORE_OFFERS_COLLECTION,
  FIRESTORE_WALLET_TRANSACTIONS_COLLECTION,
  FIRESTORE_VERIFICATION_REQUESTS_COLLECTION
} from './firebaseClient';
import { 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  updateDoc, 
  getCountFromServer,
  runTransaction
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updatePassword as updateAuthPassword, 
  signOut 
} from 'firebase/auth';
import { 
  ref, 
  uploadString, 
  listAll, 
  getMetadata, 
  getBytes 
} from 'firebase/storage';
import { hashPasswordClient } from './hashUtils';

export type Unsubscribe = () => void;

export const getFallbackOutletConfig = (): OutletConfig => {
  if (OUTLET_LOCATIONS && OUTLET_LOCATIONS.length > 0) {
    return OUTLET_LOCATIONS[0];
  }
  return {
    id: 'outlet-1',
    enabled: true,
    name: "Harino's Main Outlet",
    phone: '+917818958571',
    latitude: 28.011897,
    longitude: 77.675534,
    deliveryRadiusKm: 7,
    freeDeliveryRadiusKm: 3,
    freeDeliveryMinimumOrder: 150,
    minimumOrderIncrementPerKm: 100,
    deliveryChargePerKm: 15
  };
};

export const validateAndHealOutlet = (data: any, fallback: OutletConfig): { healedOutlet: OutletConfig; repaired: boolean } => {
  let repaired = false;
  if (!data || typeof data !== 'object') {
    return { healedOutlet: { ...fallback }, repaired: true };
  }

  const healed: any = { ...data };

  // ID check
  if (!healed.id || typeof healed.id !== 'string') {
    healed.id = fallback.id;
    repaired = true;
  }

  // check enabled
  if (healed.enabled === undefined || healed.enabled === null) {
    healed.enabled = fallback.enabled;
    repaired = true;
  } else {
    healed.enabled = healed.enabled === true || String(healed.enabled) === 'true';
  }

  // check required string fields
  const stringFields = ['name', 'phone'];
  for (const field of stringFields) {
    if (!healed[field] || typeof healed[field] !== 'string' || healed[field].trim() === '') {
      healed[field] = (fallback as any)[field];
      repaired = true;
    }
  }

  // check number fields
  const numberFields = [
    'latitude', 'longitude', 'deliveryRadiusKm', 'freeDeliveryRadiusKm',
    'freeDeliveryMinimumOrder', 'minimumOrderIncrementPerKm', 'deliveryChargePerKm'
  ];
  for (const field of numberFields) {
    const val = Number(healed[field]);
    if (healed[field] === undefined || healed[field] === null || isNaN(val)) {
      healed[field] = (fallback as any)[field];
      repaired = true;
    } else {
      healed[field] = val;
    }
  }

  return { healedOutlet: healed as OutletConfig, repaired };
};

export interface BackupDetail {
  filename: string;
  size: string;
  date: string;
  status: string;
  location: string;
}

export interface BackupStatusResponse {
  success: boolean;
  backups: BackupDetail[];
  lastBackupTime?: string;
  lastBackupSize?: string;
  lastBackupStatus?: string;
  lastBackupLocation?: string;
}

export interface NotificationDashboardData {
  success: boolean;
  totalDevices: number;
  stats: any[];
}

export const checkBusinessHours = (): boolean => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (3600000 * 5.5)); // IST is UTC+5.5
  const hours = ist.getHours();
  return hours >= 11 && hours < 21;
};

export const isOrderApiConfigured = (): boolean => true;

const sortOrders = (orders: Order[]): Order[] =>
  [...orders].sort((a, b) => new Date(b.receivedAt ?? b.date).getTime() - new Date(a.receivedAt ?? a.date).getTime());

const sortCustomers = (customers: CustomerProfile[]): CustomerProfile[] => {
  return [...customers].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
};

const DEFAULT_STAFF = [
  { role: 'admin', username: 'Admin_Harinos', password: 'Harinos@dmin', collection: 'admins', email: 'admin@harinos.local', dbPass: 'AdminDBAccessPass1!' },
  { role: 'manager', username: 'Manager_Harinos', password: 'Harinos@manager', collection: 'managers', email: 'manager@harinos.local', dbPass: 'ManagerDBAccessPass1!' },
  { role: 'staff', username: 'Staff_Harinos', password: 'Harinos@staff', collection: 'staff', email: 'staff@harinos.local', dbPass: 'StaffDBAccessPass1!' },
];

export const reauthenticateStaffSession = async (): Promise<void> => {
  const session = StorageService.getAdminSession();
  if (!session) return;
  
  const authInstance = auth();
  if (authInstance.currentUser) return;
  
  const def = DEFAULT_STAFF.find(d => d.role === session.role);
  if (def) {
    try {
      await signInWithEmailAndPassword(authInstance, def.email, def.dbPass);
      console.log('Automatically re-authenticated staff session in Firebase Auth.');
    } catch (err) {
      console.warn('Failed to auto-login staff to Firebase Auth:', err);
    }
  }
};

export const reauthenticateCustomerSession = async (): Promise<void> => {
  // Customers do not use Firebase Auth anymore; customer access is independent of Firebase Auth.
};

export const initializeFirebaseCollections = async (): Promise<void> => {
  try {
    // 1. Initialize staff accounts (admins, managers, staff)
    for (const staff of DEFAULT_STAFF) {
      try {
        const staffRef = doc(db(), staff.collection, staff.username);
        const snap = await getDoc(staffRef);
        if (!snap.exists()) {
          const hash = await hashPasswordClient(staff.password);
          await setDoc(staffRef, {
            uid: staff.username,
            username: staff.username,
            role: staff.role,
            passwordHash: hash,
            outletId: null,
            active: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
          console.log(`Auto-created default ${staff.role} document in Firestore.`);
        }
      } catch (err) {
        console.warn(`Failsafe staff init failed for ${staff.username}:`, err);
      }
    }

    // 2. Initialize settings and storeConfiguration documents if missing
    try {
      const settingsRef = doc(db(), 'settings', 'app');
      const settingsSnap = await getDoc(settingsRef);
      if (!settingsSnap.exists()) {
        await setDoc(settingsRef, {
          instagramUrl: 'https://instagram.com/harinospizza',
          menuVersion: '1.0',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Failsafe settings init failed:', err);
    }

    try {
      const configRef = doc(db(), 'storeConfiguration', 'app');
      const configSnap = await getDoc(configRef);
      if (!configSnap.exists()) {
        await setDoc(configRef, {
          instagramUrl: 'https://instagram.com/harinospizza',
          menuVersion: '1.0',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Failsafe storeConfiguration init failed:', err);
    }

    // 3. Auto-verify existence of remaining collections by creating placeholder docs if empty
    const collectionsToVerify = [
      'customers', 'customerProfiles', 'customerVerification', 'wallets', 
      'walletTransactions', 'orders', 'orderHistory', 'customerHistory', 
      'offers', 'menuItems', 'outlets', 'analytics', 'notifications', 
      'businessData', 'referrals', 'customerVerificationRequests', 'wallet_transactions'
    ];

    for (const col of collectionsToVerify) {
      try {
        const placeholderRef = doc(db(), col, '_init_placeholder');
        const snap = await getDoc(placeholderRef);
        if (!snap.exists()) {
          await setDoc(placeholderRef, {
            initialized: true,
            createdAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn(`Failsafe verify failed for collection ${col}:`, err);
      }
    }

  } catch (globalErr) {
    console.error('Failsafe global collection initialization failed:', globalErr);
  }
};

export const recoverMenuItems = async (defaultItems: MenuItem[]): Promise<void> => {
  try {
    const menuColl = collection(db(), FIRESTORE_MENU_ITEMS_COLLECTION);
    const snap = await getDocs(menuColl);
    const serverItemsMap = new Map(snap.docs.map(docDoc => [docDoc.id, docDoc.data() as MenuItem]));

    for (const defItem of defaultItems) {
      const serverItem = serverItemsMap.get(defItem.id);
      if (!serverItem) {
        await setDoc(doc(db(), FIRESTORE_MENU_ITEMS_COLLECTION, defItem.id), defItem);
        console.log(`Recovered missing menu item: ${defItem.name}`);
      } else {
        let needsUpdate = false;
        const updatedFields: any = {};

        if (!serverItem.category) {
          updatedFields.category = defItem.category;
          needsUpdate = true;
        }
        if (!serverItem.image || serverItem.image === '' || (serverItem.image.startsWith('/') && !serverItem.image.includes('.'))) {
          updatedFields.image = defItem.image;
          needsUpdate = true;
        }
        if (serverItem.price === undefined || serverItem.price === null) {
          updatedFields.price = defItem.price;
          needsUpdate = true;
        }
        if (serverItem.vegetarian === undefined) {
          updatedFields.vegetarian = defItem.vegetarian;
          needsUpdate = true;
        }
        if (serverItem.available === undefined) {
          updatedFields.available = defItem.available ?? true;
          needsUpdate = true;
        }

        if (needsUpdate) {
          await updateDoc(doc(db(), FIRESTORE_MENU_ITEMS_COLLECTION, defItem.id), updatedFields);
          console.log(`Repaired menu item fields for: ${serverItem.name}`);
        }
      }
    }
  } catch (err) {
    console.warn('Failsafe: failed to recover/repair menu items:', err);
  }
};

export const saveFullOrderToServer = async (order: Omit<Order, 'id'> & { id?: string }): Promise<Order> => {
  if (!checkBusinessHours()) {
    throw new Error("Harino's online ordering is available between 11:00 AM and 9:00 PM.");
  }

  if (order.orderType !== 'dinein') {
    const hasBeverages = order.items.some(item => item.category === Category.BEVERAGES || item.category === 'Beverages');
    if (hasBeverages) {
      throw new Error("Beverages are available for Dine-In only.");
    }
  }

  if (order.orderType === 'delivery') {
    if (order.distanceKm && order.distanceKm > 5) {
      throw new Error("Delivery is only available within 5 KM.");
    }
  }

  if (order.customerPhone) {
    const cleanPhone = order.customerPhone.replace(/\D/g, '');
    const customerSnap = await getDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanPhone));
    if (customerSnap.exists()) {
      const customerData = customerSnap.data() as CustomerProfile;
      if (customerData.status === 'blocked' || customerData.active === false) {
        throw new Error("Forbidden. Blocked customer cannot place orders.");
      }
    }
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayFormatted = todayStr.replace(/-/g, '');
  const startOfDay = new Date(todayStr + 'T00:00:00.000Z');

  const q = query(
    collection(db(), FIRESTORE_ORDERS_COLLECTION),
    where('receivedAt', '>=', startOfDay.toISOString())
  );
  const snapshot = await getDocs(q);
  const dailySeq = snapshot.size + 1;
  const orderId = `HRN-${todayFormatted}-${dailySeq}`;

  const nextOrder: Order = {
    ...order,
    id: orderId,
    receivedAt: new Date().toISOString(),
    date: new Date().toLocaleString(),
    status: 'new',
    auditTrail: [{
      timestamp: new Date().toISOString(),
      updatedBy: order.customerName ? String(order.customerName) : 'customer',
      action: 'Order placed'
    }]
  } as Order;

  await setDoc(doc(db(), FIRESTORE_ORDERS_COLLECTION, orderId), nextOrder);

  // Auto-update orderHistory
  try {
    await setDoc(doc(db(), 'orderHistory', orderId), nextOrder);
  } catch (err) {}

  try {
    const { notifyCustomerStatusChange } = await import('./notificationService');
    void notifyCustomerStatusChange(nextOrder, 'new');
  } catch (err) {
    console.warn('FCM order placement notify failed:', err);
  }

  const localOrders = StorageService.getAdminOrders().filter((o) => o.id !== orderId);
  StorageService.saveAdminOrders([nextOrder, ...localOrders]);

  return nextOrder;
};

export const getServerOrders = async (): Promise<Order[]> => {
  try {
    const session = StorageService.getAdminSession();
    let q;
    if (session && session.role === 'staff') {
      q = query(
        collection(db(), FIRESTORE_ORDERS_COLLECTION),
        where('status', 'in', ['new', 'preparing', 'ready', 'out_for_delivery'])
      );
    } else {
      q = query(
        collection(db(), FIRESTORE_ORDERS_COLLECTION),
        orderBy('receivedAt', 'desc'),
        limit(500)
      );
    }

    const snapshot = await getDocs(q);
    let ordersList = snapshot.docs
      .map((docDoc) => docDoc.data() as Order)
      .filter(o => o.id !== '_init_placeholder');

    if (session) {
      if (session.role === 'staff') {
        ordersList = ordersList.filter(o => !o.isDeleted && (session.outletId ? o.outletId === session.outletId : true));
        ordersList.sort((a, b) => {
          const timeA = a.receivedAt ? new Date(a.receivedAt).getTime() : 0;
          const timeB = b.receivedAt ? new Date(b.receivedAt).getTime() : 0;
          return timeB - timeA;
        });

        ordersList = ordersList.map(o => {
          const sanitized = { ...o };
          delete sanitized.total;
          delete sanitized.deliveryFee;
          delete sanitized.walletAmountRedeemed;
          delete sanitized.rewardPointsRedeemed;
          if (Array.isArray(sanitized.items)) {
            sanitized.items = sanitized.items.map((it: any) => {
              const cleanIt = { ...it };
              delete cleanIt.price;
              delete cleanIt.totalPrice;
              return cleanIt;
            });
          }
          return sanitized;
        });
      } else if (session.role === 'manager') {
        ordersList = ordersList.filter(o => !o.isDeleted);
      }
    }

    StorageService.saveAdminOrders(ordersList);
    return ordersList;
  } catch (error) {
    console.warn('Direct Firestore get orders failed, using cached orders:', error);
    return sortOrders(StorageService.getAdminOrders());
  }
};

export const getServerOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const snap = await getDoc(doc(db(), FIRESTORE_ORDERS_COLLECTION, orderId));
    if (!snap.exists()) return null;
    const order = snap.data() as Order;
    if (order.isDeleted) return null;

    const session = StorageService.getAdminSession();
    if (session && session.role === 'staff') {
      delete order.total;
      delete order.deliveryFee;
      delete order.walletAmountRedeemed;
      delete order.rewardPointsRedeemed;
      if (Array.isArray(order.items)) {
        order.items = order.items.map((it: any) => {
          const cleanIt = { ...it };
          delete cleanIt.price;
          delete cleanIt.totalPrice;
          return cleanIt;
        });
      }
    }
    return order;
  } catch (error) {
    console.warn('Direct Firestore get order by id failed, using cached orders:', error);
    return StorageService.getAdminOrders().find(o => o.id === orderId) || null;
  }
};

export const updateServerOrderStatus = async (orderId: string, status: OrderStatus, reason?: string): Promise<void> => {
  const session = StorageService.getAdminSession();
  const callerName = session ? session.username : 'system';

  if (status === 'cancelled' && session?.role === 'staff') {
    throw new Error('Forbidden. Staff cannot cancel orders.');
  }

  const cleanId = orderId.trim();
  const orderRef = doc(db(), FIRESTORE_ORDERS_COLLECTION, cleanId);
  const snap = await getDoc(orderRef);

  if (!snap.exists()) {
    throw new Error('Order not found.');
  }

  const orderData = snap.data() as Order;
  if (orderData.status === 'cancelled') {
    throw new Error('Cancelled orders cannot be modified.');
  }

  if (status === 'cancelled') {
    await deleteDoc(orderRef);
    try {
      await deleteDoc(doc(db(), 'orderHistory', cleanId));
    } catch (err) {}

    const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await setDoc(doc(db(), 'security_logs', logId), {
      id: logId,
      timestamp: new Date().toISOString(),
      action: 'ORDER_CANCELLED',
      username: callerName,
      details: `Permanently deleted order: ${cleanId}, Reason: ${reason || ''}`
    });

    try {
      const { notifyCustomerStatusChange } = await import('./notificationService');
      void notifyCustomerStatusChange({ ...orderData, status }, status);
    } catch (err) {
      console.warn('FCM status notify failed:', err);
    }
  } else {
    const auditTrail = orderData.auditTrail || [];
    auditTrail.push({
      timestamp: new Date().toISOString(),
      updatedBy: callerName,
      action: `Status updated to ${status}`,
      previousStatus: orderData.status,
      newStatus: status,
      reason: reason || ''
    });

    await updateDoc(orderRef, {
      status,
      statusUpdatedAt: new Date().toISOString(),
      auditTrail
    });
    try {
      await updateDoc(doc(db(), 'orderHistory', cleanId), { status, statusUpdatedAt: new Date().toISOString(), auditTrail });
    } catch (err) {}

    const localOrders = StorageService.getAdminOrders();
    const idx = localOrders.findIndex((o) => o.id === cleanId);
    if (idx >= 0) {
      localOrders[idx] = {
        ...localOrders[idx],
        status,
        statusUpdatedAt: new Date().toISOString(),
        auditTrail
      };
      StorageService.saveAdminOrders(localOrders);
    }

    try {
      const { notifyCustomerStatusChange } = await import('./notificationService');
      void notifyCustomerStatusChange({ ...orderData, status }, status);
    } catch (err) {
      console.warn('FCM status notify failed:', err);
    }
  }
};

export const deleteOrderFromServer = async (orderId: string): Promise<void> => {
  const session = StorageService.getAdminSession();
  if (!session || (session.role !== 'admin' && session.role !== 'manager')) {
    throw new Error('Forbidden. Admin/Manager role required.');
  }

  const cleanId = orderId.trim();
  const orderDocRef = doc(db(), FIRESTORE_ORDERS_COLLECTION, cleanId);

  const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  await setDoc(doc(db(), 'security_logs', logId), {
    id: logId,
    timestamp: new Date().toISOString(),
    action: 'ORDER_DELETED',
    username: session.username,
    details: `Permanently deleted order: ${cleanId}`
  });

  await deleteDoc(orderDocRef);
  try {
    await deleteDoc(doc(db(), 'orderHistory', cleanId));
  } catch (err) {}

  const localOrders = StorageService.getAdminOrders().filter((o) => o.id !== cleanId);
  StorageService.saveAdminOrders(localOrders);
};

export const saveCustomerToServer = async (profile: CustomerProfile): Promise<void> => {
  const localCusts = StorageService.getAdminCustomers().filter((c) => c.id !== profile.id);
  StorageService.saveAdminCustomers([profile, ...localCusts]);

  try {
    await setDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, profile.id), profile, { merge: true });
    await setDoc(doc(db(), 'customerProfiles', profile.id), profile, { merge: true });
  } catch (error) {
    console.warn('Direct Firestore save customer failed:', error);
    throw error;
  }
};

export const deleteCustomerFromServer = async (customerId: string): Promise<void> => {
  const rawId = customerId.trim();
  const cleanId = rawId.split('-')[0].trim().replace(/\D/g, '').slice(0, 10);
  
  const safeDelete = async (col: string, docId: string) => {
    try {
      await deleteDoc(doc(db(), col, docId));
    } catch (error) {
      console.warn(`Failsafe delete failed for ${col}/${docId}:`, error);
    }
  };

  const idsToDelete = Array.from(new Set([rawId, cleanId])).filter(Boolean);

  for (const docId of idsToDelete) {
    await safeDelete('customers', docId);
    await safeDelete('customerProfiles', docId);
    await safeDelete('wallets', docId);
    await safeDelete('customerVerificationRequests', docId);
    await safeDelete('customerVerification', docId);
    await safeDelete('customerHistory', docId);
    
    try {
      const txQuery = query(collection(db(), 'wallet_transactions'), where('customerId', '==', docId));
      const txSnap = await getDocs(txQuery);
      for (const docDoc of txSnap.docs) {
        try {
          await deleteDoc(docDoc.ref);
        } catch (e) {}
      }
    } catch (e) {}
    
    try {
      const txQuery2 = query(collection(db(), 'walletTransactions'), where('customerId', '==', docId));
      const txSnap2 = await getDocs(txQuery2);
      for (const docDoc of txSnap2.docs) {
        try {
          await deleteDoc(docDoc.ref);
        } catch (e) {}
      }
    } catch (e) {}
  }

  const localCusts = StorageService.getAdminCustomers().filter((c) => c.id !== rawId && c.id !== cleanId);
  StorageService.saveAdminCustomers(localCusts);
};

export const getServerCustomers = async (): Promise<CustomerProfile[]> => {
  try {
    const snapshot = await getDocs(
      query(collection(db(), FIRESTORE_CUSTOMERS_COLLECTION), orderBy('createdAt', 'desc'), limit(500))
    );
    const sorted = sortCustomers(
      snapshot.docs
        .map((docDoc) => docDoc.data() as CustomerProfile)
        .filter(c => c.id !== '_init_placeholder')
    );

    // Dynamic background check/heal for loaded customers
    setTimeout(() => {
      void (async () => {
        try {
          for (const customer of sorted) {
            const profileRef = doc(db(), 'customerProfiles', customer.id);
            const profileSnap = await getDoc(profileRef);
            if (!profileSnap.exists()) {
              console.log(`Background healing profile for: ${customer.id}`);
              await setDoc(profileRef, { ...customer, legacyUser: false });
            }
          }
        } catch (e) {}
      })();
    }, 100);

    StorageService.saveAdminCustomers(sorted);
    return sorted;
  } catch (error) {
    console.warn('Direct Firestore get customers failed, using cache:', error);
    return sortCustomers(StorageService.getAdminCustomers());
  }
};

export const getServerCustomerById = async (customerId: string): Promise<CustomerProfile | null> => {
  try {
    let cleanId = customerId.trim();
    if (cleanId && cleanId !== '_init_placeholder' && !cleanId.startsWith('staff_') && !cleanId.startsWith('admin_') && !cleanId.startsWith('manager_')) {
      cleanId = cleanId.split('-')[0].trim().replace(/\D/g, '').slice(0, 10);
    }
    if (!cleanId || cleanId === '_init_placeholder') return null;

    // 1. Search customerProfiles
    const profileRef = doc(db(), 'customerProfiles', cleanId);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      const profile = profileSnap.data() as CustomerProfile;
      const customerRef = doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanId);
      const customerSnap = await getDoc(customerRef);
      if (!customerSnap.exists()) {
        await setDoc(customerRef, profile);
      }
      return profile;
    }

    // 2. Search customers
    const customerRef = doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanId);
    const customerSnap = await getDoc(customerRef);
    if (customerSnap.exists()) {
      const customerData = customerSnap.data() as CustomerProfile;
      const newProfile: CustomerProfile = { ...customerData, legacyUser: false };
      await setDoc(profileRef, newProfile);
      
      const walletRef = doc(db(), 'wallets', cleanId);
      const walletSnap = await getDoc(walletRef);
      if (!walletSnap.exists()) {
        await setDoc(walletRef, {
          customerId: cleanId,
          balance: customerData.walletBalance || 0,
          createdAt: customerData.createdAt || new Date().toISOString()
        });
      }
      return newProfile;
    }

    // 3. Search legacy sources
    let legacyData: any = null;
    let legacySourceCol = '';
    let legacySourceId = '';
    const paths = [
      { col: 'customers', id: `cust_${cleanId}` },
      { col: 'legacyCustomers', id: cleanId },
      { col: 'legacyCustomers', id: `cust_${cleanId}` }
    ];
    for (const p of paths) {
      try {
        const snap = await getDoc(doc(db(), p.col, p.id));
        if (snap.exists()) {
          legacyData = snap.data();
          legacySourceCol = p.col;
          legacySourceId = p.id;
          break;
        }
      } catch (e) {}
    }

    if (legacyData) {
      let balance = legacyData.walletBalance ?? legacyData.balance ?? legacyData.rewardPoints ?? legacyData.coins ?? 0;
      try {
        const walletSnap = await getDoc(doc(db(), 'wallets', `cust_${cleanId}`));
        if (walletSnap.exists()) {
          balance = walletSnap.data().balance ?? balance;
          await deleteDoc(doc(db(), 'wallets', `cust_${cleanId}`));
        }
      } catch (e) {}

      try {
        const q1 = query(collection(db(), 'orders'), where('customerId', '==', `cust_${cleanId}`));
        const snap1 = await getDocs(q1);
        for (const d of snap1.docs) {
          await updateDoc(d.ref, { customerId: cleanId });
        }
      } catch (e) {}
      try {
        const q2 = query(collection(db(), 'orderHistory'), where('customerId', '==', `cust_${cleanId}`));
        const snap2 = await getDocs(q2);
        for (const d of snap2.docs) {
          await updateDoc(d.ref, { customerId: cleanId });
        }
      } catch (e) {}

      const nowStr = new Date().toISOString();
      const verifiedStatus = legacyData.verified === true || legacyData.status === 'verified';
      let refCode = legacyData.referralCode || '';
      if (verifiedStatus && !refCode) {
        refCode = await generateUniqueReferralCode();
      }

      const newProfile: CustomerProfile = {
        id: cleanId,
        customerId: cleanId,
        name: legacyData.name || legacyData.fullName || `Customer_${cleanId.slice(-4)}`,
        fullName: legacyData.fullName || legacyData.name || `Customer_${cleanId.slice(-4)}`,
        phone: cleanId,
        mobileNumber: cleanId,
        loginMethod: 'phone',
        verified: verifiedStatus,
        walletBalance: balance,
        loyaltyPoints: balance,
        rewardPoints: legacyData.rewardPoints ?? legacyData.loyaltyPoints ?? balance,
        active: true,
        status: 'active',
        createdAt: legacyData.createdAt || nowStr,
        lastLogin: nowStr,
        referralAttemptsRemaining: legacyData.referralAttemptsRemaining ?? 3,
        referralCodeUsed: legacyData.referralCodeUsed ?? false,
        referralLocked: legacyData.referralLocked ?? false,
        referralCode: refCode,
        legacyUser: false
      };

      await setDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanId), newProfile);
      await setDoc(profileRef, newProfile);
      await setDoc(doc(db(), 'wallets', cleanId), { customerId: cleanId, balance: balance, createdAt: nowStr });
      await setDoc(doc(db(), 'customerHistory', cleanId), { customerId: cleanId, createdAt: nowStr });

      if (legacySourceId.startsWith('cust_') || legacySourceCol === 'legacyCustomers') {
        try {
          await deleteDoc(doc(db(), legacySourceCol, legacySourceId));
        } catch (e) {}
      }
      return newProfile;
    }

    // 4. Default bootstrap to prevent errors
    const defaultName = `Customer_${cleanId.slice(-4)}`;
    const referralCode = await generateUniqueReferralCode();
    const nowStr = new Date().toISOString();
    const newProfile: CustomerProfile = {
      id: cleanId,
      customerId: cleanId,
      name: defaultName,
      fullName: defaultName,
      phone: cleanId,
      mobileNumber: cleanId,
      loginMethod: 'phone',
      verified: false,
      walletBalance: 0,
      loyaltyPoints: 0,
      rewardPoints: 0,
      active: true,
      status: 'active',
      createdAt: nowStr,
      lastLogin: nowStr,
      referralAttemptsRemaining: 3,
      referralCodeUsed: false,
      referralLocked: false,
      referralCode: referralCode,
      legacyUser: false
    };

    await setDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanId), newProfile);
    await setDoc(profileRef, newProfile);
    await setDoc(doc(db(), 'wallets', cleanId), { customerId: cleanId, balance: 0, createdAt: nowStr });
    await setDoc(doc(db(), 'customerHistory', cleanId), { customerId: cleanId, createdAt: nowStr });
    return newProfile;
  } catch (error) {
    console.warn('Direct Firestore get customer by id failed, using cache:', error);
    return StorageService.getAdminCustomers().find(c => c.id === customerId) || null;
  }
};

export const generateUniqueReferralCode = async (): Promise<string> => {
  const chars = '0123456789ABCDEF';
  let isUnique = false;
  let code = '';
  let attempts = 0;
  while (!isUnique && attempts < 50) {
    code = '';
    for (let i = 0; i < 5; i++) {
      code += chars[Math.floor(Math.random() * 16)];
    }
    const q1 = query(collection(db(), FIRESTORE_CUSTOMERS_COLLECTION), where('referralCode', '==', code));
    const snap1 = await getDocs(q1);
    const q2 = query(collection(db(), 'customerProfiles'), where('referralCode', '==', code));
    const snap2 = await getDocs(q2);
    if (snap1.empty && snap2.empty) {
      isUnique = true;
    }
    attempts++;
  }
  if (!isUnique) {
    code = '';
    for (let i = 0; i < 5; i++) {
      code += chars[Math.floor(Math.random() * 16)];
    }
  }
  return code;
};

export const registerCustomer = async (
  phone: string,
  name: string
): Promise<{ success: boolean; customer: CustomerProfile; requestId: string; message?: string }> => {
  if (!checkBusinessHours()) {
    throw new Error("Harino's online ordering is available between 11:00 AM and 9:00 PM.");
  }

  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length !== 10) {
    throw new Error('Please enter a valid 10-digit mobile number.');
  }

  const blockedSnap = await getDoc(doc(db(), 'blocked_customers', cleanPhone));
  if (blockedSnap.exists()) {
    throw new Error('This mobile number is permanently blocked.');
  }

  // Load existing customer data immediately if they are already registered
  const existingSnap = await getDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanPhone));
  if (existingSnap.exists()) {
    const customerData = existingSnap.data() as CustomerProfile;
    const updatedProfile = { ...customerData, lastLogin: new Date().toISOString() };
    await setDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanPhone), updatedProfile);
    await setDoc(doc(db(), 'customerProfiles', cleanPhone), updatedProfile);
    return {
      success: true,
      customer: updatedProfile,
      requestId: cleanPhone,
      message: 'Welcome back!'
    };
  }

  const referralCode = await generateUniqueReferralCode();
  const nowStr = new Date().toISOString();

  const customerProfile: CustomerProfile = {
    id: cleanPhone,
    customerId: cleanPhone,
    name: name.trim(),
    fullName: name.trim(),
    phone: cleanPhone,
    mobileNumber: cleanPhone,
    loginMethod: 'phone',
    verified: false,
    walletBalance: 0,
    loyaltyPoints: 0,
    rewardPoints: 0,
    active: true,
    status: 'active',
    createdAt: nowStr,
    lastLogin: nowStr,
    referralAttemptsRemaining: 3,
    referralCodeUsed: false,
    referralLocked: false,
    referralCode: referralCode
  };

  await setDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanPhone), customerProfile);
  await setDoc(doc(db(), 'customerProfiles', cleanPhone), customerProfile);
  await setDoc(doc(db(), 'wallets', cleanPhone), { customerId: cleanPhone, balance: 0, createdAt: nowStr });
  await setDoc(doc(db(), 'customerHistory', cleanPhone), { customerId: cleanPhone, createdAt: nowStr });
  await setDoc(doc(db(), 'customerVerificationRequests', cleanPhone), {
    requestId: cleanPhone,
    customerId: cleanPhone,
    customerName: name.trim(),
    mobileNumber: cleanPhone,
    otp: 'NO_OTP',
    status: 'pending',
    createdAt: nowStr,
    verifiedAt: null,
    verifiedBy: null
  });

  return {
    success: true,
    customer: customerProfile,
    requestId: cleanPhone,
    message: 'Account created successfully!'
  };
};

export const initCustomerLogin = async (
  phone: string,
  name?: string,
  isRegistering?: boolean
): Promise<{ success: boolean; exists: boolean; customer?: CustomerProfile; requestId?: string; message?: string }> => {
  if (!checkBusinessHours()) {
    throw new Error("Harino's online ordering is available between 11:00 AM and 9:00 PM.");
  }

  const cleanPhone = phone.split('-')[0].replace(/\D/g, '').slice(0, 10);
  if (cleanPhone.length !== 10) {
    throw new Error('Please enter a valid 10-digit mobile number.');
  }

  const blockedSnap = await getDoc(doc(db(), 'blocked_customers', cleanPhone));
  if (blockedSnap.exists()) {
    throw new Error('This mobile number is permanently blocked.');
  }

  // Step 1: Search customerProfiles collection
  const profileRef = doc(db(), 'customerProfiles', cleanPhone);
  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists()) {
    const customerData = profileSnap.data() as CustomerProfile;
    if (customerData.active === false || customerData.status === 'blocked') {
      return { success: false, exists: true, message: 'Account disabled' };
    }
    
    // Auto-update default names with customer's entered name
    let updatedName = customerData.name || '';
    if (name && name.trim() && (!updatedName || updatedName.startsWith('Customer_'))) {
      updatedName = name.trim();
    }
    let updatedFullName = customerData.fullName || '';
    if (name && name.trim() && (!updatedFullName || updatedFullName.startsWith('Customer_'))) {
      updatedFullName = name.trim();
    }

    const updatedProfile = { 
      ...customerData, 
      name: updatedName,
      fullName: updatedFullName,
      lastLogin: new Date().toISOString() 
    };
    await setDoc(profileRef, updatedProfile);
    
    // Sync to customers collection
    const customerRef = doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanPhone);
    const customerSnap = await getDoc(customerRef);
    if (!customerSnap.exists()) {
      await setDoc(customerRef, updatedProfile);
    } else {
      await updateDoc(customerRef, { 
        name: updatedProfile.name,
        fullName: updatedProfile.fullName,
        lastLogin: updatedProfile.lastLogin 
      });
    }

    return {
      success: true,
      exists: true,
      customer: updatedProfile,
      requestId: cleanPhone,
      message: 'Login successful!'
    };
  }

  // Step 2: Search legacy customer collections
  let legacyData: any = null;
  let legacySourceCol = '';
  let legacySourceId = '';

  const paths = [
    { col: 'customers', id: cleanPhone },
    { col: 'customers', id: `cust_${cleanPhone}` },
    { col: 'legacyCustomers', id: cleanPhone },
    { col: 'legacyCustomers', id: `cust_${cleanPhone}` }
  ];

  for (const p of paths) {
    try {
      const snap = await getDoc(doc(db(), p.col, p.id));
      if (snap.exists()) {
        legacyData = snap.data();
        legacySourceCol = p.col;
        legacySourceId = p.id;
        break;
      }
    } catch (e) {
      console.warn(`Failed legacy lookup in ${p.col}/${p.id}:`, e);
    }
  }

  if (legacyData) {
    let balance = legacyData.walletBalance ?? legacyData.balance ?? legacyData.rewardPoints ?? legacyData.coins ?? 0;
    try {
      const walletSnap1 = await getDoc(doc(db(), 'wallets', cleanPhone));
      if (walletSnap1.exists()) {
        balance = walletSnap1.data().balance ?? balance;
      } else {
        const walletSnap2 = await getDoc(doc(db(), 'wallets', `cust_${cleanPhone}`));
        if (walletSnap2.exists()) {
          balance = walletSnap2.data().balance ?? balance;
          await deleteDoc(doc(db(), 'wallets', `cust_${cleanPhone}`));
        }
      }
    } catch (e) {
      console.warn('Failed to resolve legacy wallet:', e);
    }

    // Update past orders customerId references from legacy to standardized phone number
    try {
      const q1 = query(collection(db(), 'orders'), where('customerId', '==', `cust_${cleanPhone}`));
      const snap1 = await getDocs(q1);
      for (const d of snap1.docs) {
        await updateDoc(d.ref, { customerId: cleanPhone });
      }
    } catch (e) {}
    try {
      const q2 = query(collection(db(), 'orderHistory'), where('customerId', '==', `cust_${cleanPhone}`));
      const snap2 = await getDocs(q2);
      for (const d of snap2.docs) {
        await updateDoc(d.ref, { customerId: cleanPhone });
      }
    } catch (e) {}

    const nowStr = new Date().toISOString();
    const verifiedStatus = legacyData.verified === true || legacyData.status === 'verified';
    let refCode = legacyData.referralCode || '';
    if (verifiedStatus && !refCode) {
      refCode = await generateUniqueReferralCode();
    }

    const customerProfile: CustomerProfile = {
      id: cleanPhone,
      customerId: cleanPhone,
      name: legacyData.name || legacyData.fullName || name?.trim() || `Customer_${cleanPhone.slice(-4)}`,
      fullName: legacyData.fullName || legacyData.name || name?.trim() || `Customer_${cleanPhone.slice(-4)}`,
      phone: cleanPhone,
      mobileNumber: cleanPhone,
      loginMethod: 'phone',
      verified: verifiedStatus,
      walletBalance: balance,
      loyaltyPoints: balance,
      rewardPoints: legacyData.rewardPoints ?? legacyData.loyaltyPoints ?? balance,
      active: true,
      status: 'active',
      createdAt: legacyData.createdAt || nowStr,
      lastLogin: nowStr,
      referralAttemptsRemaining: legacyData.referralAttemptsRemaining ?? 3,
      referralCodeUsed: legacyData.referralCodeUsed ?? false,
      referralLocked: legacyData.referralLocked ?? false,
      referralCode: refCode,
      legacyUser: false
    };

    await setDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanPhone), customerProfile);
    await setDoc(doc(db(), 'customerProfiles', cleanPhone), customerProfile);
    await setDoc(doc(db(), 'wallets', cleanPhone), { customerId: cleanPhone, balance: balance, createdAt: nowStr });
    await setDoc(doc(db(), 'customerHistory', cleanPhone), { customerId: cleanPhone, createdAt: nowStr });
    await setDoc(doc(db(), 'customerVerificationRequests', cleanPhone), {
      requestId: cleanPhone,
      customerId: cleanPhone,
      customerName: customerProfile.name,
      mobileNumber: cleanPhone,
      otp: 'NO_OTP',
      status: verifiedStatus ? 'verified' : 'pending',
      createdAt: nowStr,
      verifiedAt: verifiedStatus ? nowStr : null,
      verifiedBy: verifiedStatus ? 'admin' : null
    });

    if (legacySourceId.startsWith('cust_') || legacySourceCol === 'legacyCustomers') {
      try {
        await deleteDoc(doc(db(), legacySourceCol, legacySourceId));
      } catch (e) {}
    }

    return {
      success: true,
      exists: true,
      customer: customerProfile,
      requestId: cleanPhone,
      message: 'Account restored automatically!'
    };
  }

  // Step 3: Create a new customer profile automatically
  const defaultName = name ? name.trim() : `Customer_${cleanPhone.slice(-4)}`;
  const referralCode = await generateUniqueReferralCode();
  const nowStr = new Date().toISOString();

  const customerProfile: CustomerProfile = {
    id: cleanPhone,
    customerId: cleanPhone,
    name: defaultName,
    fullName: defaultName,
    phone: cleanPhone,
    mobileNumber: cleanPhone,
    loginMethod: 'phone',
    verified: false,
    walletBalance: 0,
    loyaltyPoints: 0,
    rewardPoints: 0,
    active: true,
    status: 'active',
    createdAt: nowStr,
    lastLogin: nowStr,
    referralAttemptsRemaining: 3,
    referralCodeUsed: false,
    referralLocked: false,
    referralCode: referralCode
  };

  await setDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanPhone), customerProfile);
  await setDoc(doc(db(), 'customerProfiles', cleanPhone), customerProfile);
  await setDoc(doc(db(), 'wallets', cleanPhone), { customerId: cleanPhone, balance: 0, createdAt: nowStr });
  await setDoc(doc(db(), 'customerHistory', cleanPhone), { customerId: cleanPhone, createdAt: nowStr });
  await setDoc(doc(db(), 'customerVerificationRequests', cleanPhone), {
    requestId: cleanPhone,
    customerId: cleanPhone,
    customerName: defaultName,
    mobileNumber: cleanPhone,
    otp: 'NO_OTP',
    status: 'pending',
    createdAt: nowStr,
    verifiedAt: null,
    verifiedBy: null
  });

  return {
    success: true,
    exists: true,
    customer: customerProfile,
    requestId: cleanPhone,
    message: 'Account created automatically!'
  };
};

export const verifyCustomerLogin = async (
  requestId: string,
  otp: string
): Promise<{ success: boolean; customer?: CustomerProfile; message?: string }> => {
  return { success: true };
};

export const verifyServerCustomer = async (customerId: string, otp?: string): Promise<CustomerProfile | null> => {
  const cleanId = customerId.trim();
  const customerRef = doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanId);
  const profileRef = doc(db(), 'customerProfiles', cleanId);
  const verifyRef = doc(db(), 'customerVerificationRequests', cleanId);

  const snap = await getDoc(customerRef);
  let referralCode = '';
  if (snap.exists()) {
    const data = snap.data() as CustomerProfile;
    referralCode = data.referralCode || '';
  }
  const isFiveCharHex = /^[0-9A-F]{5}$/.test(referralCode);
  if (!referralCode || !isFiveCharHex) {
    referralCode = await generateUniqueReferralCode();
  }

  await updateDoc(customerRef, { verified: true, legacyUser: false, referralCode });
  try {
    await updateDoc(profileRef, { verified: true, legacyUser: false, referralCode });
  } catch (err) {}
  try {
    await updateDoc(verifyRef, {
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'admin'
    });
  } catch (err) {}

  const freshSnap = await getDoc(customerRef);
  return freshSnap.exists() ? (freshSnap.data() as CustomerProfile) : null;
};

export const blockCustomerOnServer = async (customerId: string, blocked: boolean): Promise<any> => {
  const cleanId = customerId.trim();
  const status = blocked ? 'blocked' : 'active';
  const active = !blocked;

  await updateDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanId), { status, active });
  try {
    await updateDoc(doc(db(), 'customerProfiles', cleanId), { status, active });
  } catch (err) {}

  if (blocked) {
    await setDoc(doc(db(), 'blocked_customers', cleanId), {
      phone: cleanId,
      blockedAt: new Date().toISOString(),
      customerId: cleanId
    });
  } else {
    await deleteDoc(doc(db(), 'blocked_customers', cleanId));
  }

  return { success: true };
};

export const bulkRemoveCustomersFromServer = async (customerIds: string[]): Promise<any> => {
  for (const id of customerIds) {
    await deleteCustomerFromServer(id);
  }
  return { success: true };
};

export const mergeCustomersOnServer = async (primaryId: string, secondaryId: string): Promise<any> => {
  const pId = primaryId.trim();
  const sId = secondaryId.trim();
  if (pId === sId) {
    throw new Error('Primary and secondary profiles cannot be the same.');
  }

  const primaryRef = doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, pId);
  const secondaryRef = doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, sId);

  await runTransaction(db(), async (transaction) => {
    const primarySnap = await transaction.get(primaryRef);
    const secondarySnap = await transaction.get(secondaryRef);

    if (!primarySnap.exists()) {
      throw new Error('Primary customer not found.');
    }
    if (!secondarySnap.exists()) {
      throw new Error('Secondary customer not found.');
    }

    const primaryData = primarySnap.data() as CustomerProfile;
    const secondaryData = secondarySnap.data() as CustomerProfile;

    const mergedBalance = (primaryData.walletBalance || 0) + (secondaryData.walletBalance || 0);
    const mergedPoints = (primaryData.rewardPoints || primaryData.loyaltyPoints || 0) + (secondaryData.rewardPoints || secondaryData.loyaltyPoints || 0);

    transaction.update(primaryRef, {
      walletBalance: mergedBalance,
      rewardPoints: mergedPoints,
      loyaltyPoints: mergedPoints
    });

    transaction.delete(secondaryRef);

    const txId = `tx_merge_${Date.now()}`;
    const txRef = doc(db(), FIRESTORE_WALLET_TRANSACTIONS_COLLECTION, txId);
    transaction.set(txRef, {
      id: txId,
      customerId: pId,
      customerName: primaryData.name || primaryData.fullName || 'Customer',
      customerPhone: primaryData.phone || primaryData.mobileNumber || '',
      amount: secondaryData.walletBalance || 0,
      type: 'credit',
      status: 'completed',
      createdAt: new Date().toISOString(),
      description: `Merged profile ${sId}. Transferred Rs ${secondaryData.walletBalance || 0} and ${mergedPoints} points.`
    });
  });

  return { success: true };
};

export const subscribeServerOrders = (
  onOrders: (orders: Order[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  const session = StorageService.getAdminSession();
  let q;
  if (session && session.role === 'staff') {
    q = query(
      collection(db(), FIRESTORE_ORDERS_COLLECTION),
      where('status', 'in', ['new', 'preparing', 'ready', 'out_for_delivery'])
    );
  } else {
    q = query(
      collection(db(), FIRESTORE_ORDERS_COLLECTION),
      orderBy('receivedAt', 'desc'),
      limit(500)
    );
  }

  return onSnapshot(
    q,
    (snapshot) => {
      let ordersList = snapshot.docs
        .map((docDoc) => docDoc.data() as Order)
        .filter(o => o.id !== '_init_placeholder');
      if (session) {
        if (session.role === 'staff') {
          ordersList = ordersList.filter(o => !o.isDeleted && (session.outletId ? o.outletId === session.outletId : true));
          ordersList.sort((a, b) => {
            const timeA = a.receivedAt ? new Date(a.receivedAt).getTime() : 0;
            const timeB = b.receivedAt ? new Date(b.receivedAt).getTime() : 0;
            return timeB - timeA;
          });
          ordersList = ordersList.map(o => {
            const sanitized = { ...o };
            delete sanitized.total;
            delete sanitized.deliveryFee;
            delete sanitized.walletAmountRedeemed;
            delete sanitized.rewardPointsRedeemed;
            if (Array.isArray(sanitized.items)) {
              sanitized.items = sanitized.items.map((it: any) => {
                const cleanIt = { ...it };
                delete cleanIt.price;
                delete cleanIt.totalPrice;
                return cleanIt;
              });
            }
            return sanitized;
          });
        } else if (session.role === 'manager') {
          ordersList = ordersList.filter(o => !o.isDeleted);
        }
      }
      onOrders(ordersList);
    },
    (error) => {
      onError(error);
    }
  );
};

export const subscribeServerCustomers = (
  onCustomers: (customers: CustomerProfile[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  return onSnapshot(
    query(collection(db(), FIRESTORE_CUSTOMERS_COLLECTION), orderBy('createdAt', 'desc'), limit(500)),
    (snapshot) => {
      const customers = snapshot.docs
        .map((docDoc) => docDoc.data() as CustomerProfile)
        .filter(c => c.id !== '_init_placeholder');
      onCustomers(customers);
    },
    (error) => {
      onError(error);
    }
  );
};

export const subscribeServerVerificationRequests = (
  onRequests: (requests: VerificationRequest[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  return onSnapshot(
    query(collection(db(), FIRESTORE_VERIFICATION_REQUESTS_COLLECTION), orderBy('createdAt', 'desc'), limit(500)),
    (snapshot) => {
      const requests = snapshot.docs
        .map((docDoc) => docDoc.data() as VerificationRequest)
        .filter(r => r.requestId !== '_init_placeholder');
      onRequests(requests);
    },
    (error) => {
      onError(error);
    }
  );
};

export const subscribeServerOrder = (
  orderId: string,
  onOrder: (order: Order | null) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  const session = StorageService.getAdminSession();
  return onSnapshot(
    doc(db(), FIRESTORE_ORDERS_COLLECTION, orderId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onOrder(null);
        return;
      }
      const order = snapshot.data() as Order;
      if (order.isDeleted) {
        onOrder(null);
        return;
      }
      if (session && session.role === 'staff') {
        delete order.total;
        delete order.deliveryFee;
        delete order.walletAmountRedeemed;
        delete order.rewardPointsRedeemed;
        if (Array.isArray(order.items)) {
          order.items = order.items.map((it: any) => {
            const cleanIt = { ...it };
            delete cleanIt.price;
            delete cleanIt.totalPrice;
            return cleanIt;
          });
        }
      }
      onOrder(order);
    },
    (error) => {
      onError(error);
    }
  );
};

export const authenticateAdminViaApi = async (username: string, password: string): Promise<any> => {
  let role: AdminSession['role'] | null = null;
  let collectionName = '';
  let userDoc: any = null;

  const docSnapAdmins = await getDoc(doc(db(), 'admins', username));
  if (docSnapAdmins.exists()) {
    role = 'admin';
    collectionName = 'admins';
    userDoc = docSnapAdmins.data();
  } else {
    const docSnapManagers = await getDoc(doc(db(), 'managers', username));
    if (docSnapManagers.exists()) {
      role = 'manager';
      collectionName = 'managers';
      userDoc = docSnapManagers.data();
    } else {
      const docSnapStaff = await getDoc(doc(db(), 'staff', username));
      if (docSnapStaff.exists()) {
        role = 'staff';
        collectionName = 'staff';
        userDoc = docSnapStaff.data();
      }
    }
  }

  const def = DEFAULT_STAFF.find(d => d.username === username);
  if (!userDoc) {
    if (def && password === def.password) {
      const hash = await hashPasswordClient(password);
      userDoc = {
        uid: username,
        username: username,
        role: def.role,
        passwordHash: hash,
        outletId: null,
        active: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      await setDoc(doc(db(), def.collection, username), userDoc);
      role = def.role as any;
      collectionName = def.collection;
    } else {
      throw new Error('Invalid credentials.');
    }
  } else {
    const hash = await hashPasswordClient(password);
    let isPasswordCorrect = false;

    if (userDoc.passwordHash === hash) {
      isPasswordCorrect = true;
    } else if (userDoc.password === password || userDoc.passwordHash === password) {
      isPasswordCorrect = true;
      await updateDoc(doc(db(), collectionName, username), { passwordHash: hash });
    } else if (def && password === def.password) {
      isPasswordCorrect = true;
      await updateDoc(doc(db(), collectionName, username), { passwordHash: hash });
    }

    if (!isPasswordCorrect) {
      throw new Error('Invalid credentials.');
    }

    if (userDoc.active === false) {
      throw new Error('Account disabled');
    }
  }

  const currentRoleDef = DEFAULT_STAFF.find(d => d.role === role);
  if (!currentRoleDef) {
    throw new Error('System error: invalid role configuration.');
  }

  let userCredential;
  try {
    userCredential = await signInWithEmailAndPassword(auth(), currentRoleDef.email, currentRoleDef.dbPass);
  } catch (err: any) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      userCredential = await createUserWithEmailAndPassword(auth(), currentRoleDef.email, currentRoleDef.dbPass);
    } else {
      throw err;
    }
  }

  await updateDoc(doc(db(), collectionName, username), { lastLogin: new Date().toISOString() });

  const newSessionId = `session_${Date.now()}`;

  if (role === 'admin' || role === 'manager') {
    try {
      await setDoc(doc(db(), 'userSessions', username), {
        sessionId: newSessionId,
        username: username,
        role: role,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log(`Registered new session ${newSessionId} for ${username} in Firestore.`);
    } catch (sessionErr) {
      console.warn('Failed to register session ID in Firestore:', sessionErr);
    }
  }

  return {
    role: role,
    username: username,
    outletId: userDoc.outletId || null,
    token: userCredential.user.uid,
    firebaseToken: undefined,
    sessionId: newSessionId
  };
};

export const getServerMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const snapshot = await getDocs(collection(db(), FIRESTORE_MENU_ITEMS_COLLECTION));
    const items = snapshot.docs
      .map((docDoc) => docDoc.data() as MenuItem)
      .filter(i => i.id !== '_init_placeholder');
    StorageService.saveAdminMenuItems(items);
    return items;
  } catch (error) {
    console.warn('Direct Firestore get menu items failed, using cache:', error);
    return StorageService.getAdminMenuItems();
  }
};

export const saveMenuItemToServer = async (item: MenuItem): Promise<void> => {
  const localItems = StorageService.getAdminMenuItems().filter((i) => i.id !== item.id);
  StorageService.saveAdminMenuItems([item, ...localItems]);

  try {
    await setDoc(doc(db(), FIRESTORE_MENU_ITEMS_COLLECTION, item.id), item, { merge: true });
  } catch (error) {
    console.warn('Direct Firestore save menu item failed:', error);
    throw error;
  }
};

export const seedMenuItemsToServer = async (items: MenuItem[]): Promise<void> => {
  StorageService.saveAdminMenuItems(items);

  try {
    const promises = items.map(item =>
      setDoc(doc(db(), FIRESTORE_MENU_ITEMS_COLLECTION, item.id), item, { merge: true })
    );
    await Promise.all(promises);
  } catch (error) {
    console.warn('Direct Firestore seed menu items failed:', error);
    throw error;
  }
};

export const subscribeServerMenuItems = (
  onItems: (items: MenuItem[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  return onSnapshot(
    collection(db(), FIRESTORE_MENU_ITEMS_COLLECTION),
    (snapshot) => {
      const items = snapshot.docs
        .map((docDoc) => docDoc.data() as MenuItem)
        .filter(i => i.id !== '_init_placeholder');
      onItems(items);
    },
    (error) => {
      onError(error);
    }
  );
};

export const getServerOutlets = async (): Promise<OutletConfig[]> => {
  const fallbackConfig = getFallbackOutletConfig();
  try {
    const snapshot = await getDocs(collection(db(), FIRESTORE_OUTLETS_COLLECTION));
    const list: OutletConfig[] = [];

    for (const docDoc of snapshot.docs) {
      if (docDoc.id === '_init_placeholder') continue;
      const data = docDoc.data();
      const { healedOutlet, repaired } = validateAndHealOutlet(data, fallbackConfig);
      
      if (repaired) {
        console.log(`[OUTLET HEALING] Repaired empty/corrupted outlet document with ID: ${docDoc.id}`);
        try {
          await setDoc(docDoc.ref, healedOutlet, { merge: true });
        } catch (saveErr) {
          console.warn(`[OUTLET HEALING] Failed to save healed outlet ${docDoc.id} back to Firestore:`, saveErr);
        }
      }
      list.push(healedOutlet);
    }

    if (list.length === 0) {
      console.log('[OUTLET HEALING] No outlets found in Firestore. Seeding default configuration...');
      try {
        await seedOutletsToServer(OUTLET_LOCATIONS);
      } catch (seedErr) {
        console.warn('[OUTLET HEALING] Failed to seed default outlets to Firestore:', seedErr);
      }
      StorageService.saveAdminOutlets(OUTLET_LOCATIONS);
      return OUTLET_LOCATIONS;
    }

    StorageService.saveAdminOutlets(list);
    return list;
  } catch (error) {
    console.warn('Direct Firestore get outlets failed, falling back to cache/constants:', error);
    const cached = StorageService.getAdminOutlets();
    if (cached && cached.length > 0) {
      return cached;
    }
    return OUTLET_LOCATIONS;
  }
};

export const saveOutletToServer = async (outlet: OutletConfig): Promise<void> => {
  const localList = StorageService.getAdminOutlets().filter((o) => o.id !== outlet.id);
  StorageService.saveAdminOutlets([outlet, ...localList]);

  try {
    await setDoc(doc(db(), FIRESTORE_OUTLETS_COLLECTION, outlet.id), outlet, { merge: true });
  } catch (error) {
    console.warn('Direct Firestore save outlet failed:', error);
    throw error;
  }
};

export const deleteOutletFromServer = async (outletId: string): Promise<void> => {
  const localList = StorageService.getAdminOutlets().filter((o) => o.id !== outletId);
  StorageService.saveAdminOutlets(localList);

  try {
    await deleteDoc(doc(db(), FIRESTORE_OUTLETS_COLLECTION, outletId));
  } catch (error) {
    console.warn('Direct Firestore delete outlet failed:', error);
    throw error;
  }
};

export const seedOutletsToServer = async (outlets: OutletConfig[]): Promise<void> => {
  StorageService.saveAdminOutlets(outlets);

  try {
    const promises = outlets.map(outlet =>
      setDoc(doc(db(), FIRESTORE_OUTLETS_COLLECTION, outlet.id), outlet, { merge: true })
    );
    await Promise.all(promises);
  } catch (error) {
    console.warn('Direct Firestore seed outlets failed:', error);
    throw error;
  }
};

export const subscribeServerOutlets = (
  onOutlets: (outlets: OutletConfig[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  const fallbackConfig = getFallbackOutletConfig();
  return onSnapshot(
    collection(db(), FIRESTORE_OUTLETS_COLLECTION),
    (snapshot) => {
      const outlets = snapshot.docs
        .map((docDoc) => {
          if (docDoc.id === '_init_placeholder') return null;
          const data = docDoc.data();
          const { healedOutlet } = validateAndHealOutlet(data, fallbackConfig);
          return healedOutlet;
        })
        .filter((o): o is OutletConfig => o !== null);
      
      if (outlets.length === 0) {
        onOutlets(OUTLET_LOCATIONS);
      } else {
        onOutlets(outlets);
      }
    },
    (error) => {
      console.warn('Outlets subscription failed, falling back to cache/constants:', error);
      const cached = StorageService.getAdminOutlets();
      if (cached && cached.length > 0) {
        onOutlets(cached);
      } else {
        onOutlets(OUTLET_LOCATIONS);
      }
      onError(error);
    }
  );
};

export const getServerOffers = async (): Promise<OfferCard[]> => {
  try {
    const snapshot = await getDocs(collection(db(), FIRESTORE_OFFERS_COLLECTION));
    const list = snapshot.docs
      .map((docDoc) => docDoc.data() as OfferCard)
      .filter(o => o.id !== '_init_placeholder');
    StorageService.saveAdminOffers(list);
    return list;
  } catch (error) {
    console.warn('Direct Firestore get offers failed, using cache:', error);
    return StorageService.getAdminOffers();
  }
};

export const saveOfferToServer = async (offer: OfferCard): Promise<void> => {
  const localList = StorageService.getAdminOffers().filter((o) => o.id !== offer.id);
  StorageService.saveAdminOffers([offer, ...localList]);

  try {
    await setDoc(doc(db(), FIRESTORE_OFFERS_COLLECTION, offer.id), offer, { merge: true });
  } catch (error) {
    console.warn('Direct Firestore save offer failed:', error);
    throw error;
  }
};

export const seedOffersToServer = async (offers: OfferCard[]): Promise<void> => {
  StorageService.saveAdminOffers(offers);

  try {
    const promises = offers.map(offer =>
      setDoc(doc(db(), FIRESTORE_OFFERS_COLLECTION, offer.id), offer, { merge: true })
    );
    await Promise.all(promises);
  } catch (error) {
    console.warn('Direct Firestore seed offers failed:', error);
    throw error;
  }
};

export const subscribeServerOffers = (
  onOffers: (offers: OfferCard[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  return onSnapshot(
    collection(db(), FIRESTORE_OFFERS_COLLECTION),
    (snapshot) => {
      const offers = snapshot.docs
        .map((docDoc) => docDoc.data() as OfferCard)
        .filter(o => o.id !== '_init_placeholder');
      onOffers(offers);
    },
    (error) => {
      onError(error);
    }
  );
};

export const changeStaffPassword = async (
  username: string,
  newPassword: string
): Promise<void> => {
  let collectionName = '';
  const snapAdmins = await getDoc(doc(db(), 'admins', username));
  if (snapAdmins.exists()) collectionName = 'admins';
  else {
    const snapManagers = await getDoc(doc(db(), 'managers', username));
    if (snapManagers.exists()) collectionName = 'managers';
    else {
      const snapStaff = await getDoc(doc(db(), 'staff', username));
      if (snapStaff.exists()) collectionName = 'staff';
    }
  }

  if (!collectionName) {
    throw new Error('User not found.');
  }

  const hash = await hashPasswordClient(newPassword);
  await updateDoc(doc(db(), collectionName, username), { passwordHash: hash });

  const session = StorageService.getAdminSession();
  if (session && session.username === username) {
    const authInstance = auth();
    if (authInstance.currentUser) {
      await updateAuthPassword(authInstance.currentUser, newPassword);
    }
  }
};

export const changeAdminPasswordWithVerification = async (
  username: string, 
  previousPass: string, 
  newPassword: string
): Promise<void> => {
  const docRef = doc(db(), 'admins', username);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    throw new Error('Admin account not found in database.');
  }
  const data = snap.data();
  const oldHash = await hashPasswordClient(previousPass);
  if (data.passwordHash !== oldHash && data.password !== previousPass) {
    throw new Error('Incorrect previous password.');
  }

  const hash = await hashPasswordClient(newPassword);
  await updateDoc(docRef, { passwordHash: hash, password: newPassword });

  // Update in Firebase Auth if it's the current user
  const authInstance = auth();
  if (authInstance.currentUser) {
    try {
      await updateAuthPassword(authInstance.currentUser, newPassword);
    } catch (authErr) {
      console.warn('Failed to update password in Firebase Auth:', authErr);
    }
  }
};

export const getServerWalletTransactions = async (): Promise<WalletTransaction[]> => {
  try {
    const snapshot = await getDocs(
      query(collection(db(), FIRESTORE_WALLET_TRANSACTIONS_COLLECTION), orderBy('createdAt', 'desc'), limit(500))
    );
    const list = snapshot.docs
      .map((docDoc) => docDoc.data() as WalletTransaction)
      .filter(t => t.id !== '_init_placeholder');
    StorageService.saveAdminTransactions(list);
    return list;
  } catch (error) {
    console.warn('Direct Firestore get transactions failed, using cache:', error);
    return StorageService.getAdminTransactions();
  }
};

export const saveWalletTransactionToServer = async (transaction: WalletTransaction): Promise<void> => {
  const localList = StorageService.getAdminTransactions().filter((t) => t.id !== transaction.id);
  StorageService.saveAdminTransactions([transaction, ...localList]);

  try {
    await setDoc(doc(db(), FIRESTORE_WALLET_TRANSACTIONS_COLLECTION, transaction.id), transaction, { merge: true });
    
    const custRef = doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, transaction.customerId);
    const custSnap = await getDoc(custRef);
    if (custSnap.exists()) {
      const custData = custSnap.data() as CustomerProfile;
      const currentBalance = custData.walletBalance || 0;
      let newBalance = currentBalance;
      if (transaction.status === 'completed') {
        if (transaction.type === 'topup' || transaction.type === 'credit' || transaction.type === 'reward' || transaction.type === 'admin_adjustment') {
          newBalance += transaction.amount;
        } else if (transaction.type === 'debit') {
          newBalance -= transaction.amount;
        }
      }
      await updateDoc(custRef, { walletBalance: newBalance });
      await updateDoc(doc(db(), 'customerProfiles', transaction.customerId), { walletBalance: newBalance });
      await setDoc(doc(db(), 'wallets', transaction.customerId), { customerId: transaction.customerId, balance: newBalance }, { merge: true });
    }
  } catch (error) {
    console.warn('Direct Firestore save transaction failed:', error);
  }
};

export const subscribeServerWalletTransactions = (
  onTransactions: (transactions: WalletTransaction[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  return onSnapshot(
    query(collection(db(), FIRESTORE_WALLET_TRANSACTIONS_COLLECTION), orderBy('createdAt', 'desc'), limit(500)),
    (snapshot) => {
      const txs = snapshot.docs
        .map((docDoc) => docDoc.data() as WalletTransaction)
        .filter(t => t.id !== '_init_placeholder');
      onTransactions(txs);
    },
    (error) => {
      onError(error);
    }
  );
};

export const getServerSettings = async (): Promise<AppSettings> => {
  try {
    const snap = await getDoc(doc(db(), 'settings', 'app'));
    if (!snap.exists()) return {};
    return snap.data() as AppSettings;
  } catch (error) {
    console.warn('Direct Firestore get settings failed, using cache:', error);
    return {};
  }
};

export const saveSettingsToServer = async (settings: AppSettings): Promise<void> => {
  try {
    await setDoc(doc(db(), 'settings', 'app'), settings, { merge: true });
    await setDoc(doc(db(), 'storeConfiguration', 'app'), settings, { merge: true });
  } catch (error) {
    console.warn('Direct Firestore save settings failed:', error);
    throw error;
  }
};

export const getFirestoreUsage = async (): Promise<any[]> => {
  try {
    const snapshot = await getDocs(collection(db(), 'firestore_usage'));
    const usageData = snapshot.docs.map(docDoc => ({
      date: docDoc.id,
      ...docDoc.data()
    }));
    usageData.sort((a, b) => b.date.localeCompare(a.date));
    return usageData;
  } catch (error) {
    console.warn('Direct Firestore get usage failed:', error);
    return [];
  }
};

export const getBackupStatus = async (): Promise<BackupStatusResponse> => {
  try {
    const backupsRef = ref(storage(), 'backups');
    const res = await listAll(backupsRef);
    const backupsList: BackupDetail[] = [];
    for (const itemRef of res.items) {
      try {
        const metadata = await getMetadata(itemRef);
        backupsList.push({
          filename: itemRef.name,
          size: `${Math.round(metadata.size / 1024)} KB`,
          date: metadata.timeCreated,
          status: 'completed',
          location: 'Firebase Storage'
        });
      } catch (err) {
        console.warn('Metadata fetch failed for backup item:', itemRef.name, err);
      }
    }
    backupsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastBackup = backupsList[0];
    return {
      success: true,
      backups: backupsList,
      lastBackupTime: lastBackup ? new Date(lastBackup.date).toLocaleString() : 'Never',
      lastBackupSize: lastBackup ? lastBackup.size : '0 KB',
      lastBackupStatus: lastBackup ? 'completed' : 'N/A',
      lastBackupLocation: lastBackup ? 'Firebase Storage' : 'N/A'
    };
  } catch (error: any) {
    console.error('Backup listing failed:', error);
    throw new Error(error.message || 'Failed to list backups.');
  }
};

export const triggerDatabaseBackup = async (): Promise<any> => {
  try {
    const collectionsToBackup = [
      'admins', 'managers', 'staff', 'customers', 'customerProfiles',
      'customerVerification', 'wallets', 'walletTransactions', 'orders',
      'orderHistory', 'customerHistory', 'offers', 'menuItems', 'outlets',
      'analytics', 'notifications', 'storeConfiguration', 'businessData',
      'referrals', 'customerVerificationRequests', 'wallet_transactions',
      'settings'
    ];

    const backupData: Record<string, any[]> = {};
    for (const col of collectionsToBackup) {
      try {
        const snap = await getDocs(collection(db(), col));
        backupData[col] = snap.docs.map(docDoc => ({ id: docDoc.id, ...docDoc.data() }));
      } catch (err) {
        console.warn(`Could not fetch collection ${col} during backup:`, err);
      }
    }

    const jsonStr = JSON.stringify(backupData);
    const filename = `backup_${Date.now()}.json`;
    const storageRef = ref(storage(), `backups/${filename}`);
    
    await uploadString(storageRef, jsonStr, 'raw', { contentType: 'application/json' });
    
    return {
      success: true,
      backup: {
        filename,
        location: 'Firebase Storage'
      }
    };
  } catch (error: any) {
    console.error('Database backup failed:', error);
    throw new Error(error.message || 'Failed to create backup.');
  }
};

export const triggerDatabaseRestore = async (filename: string): Promise<any> => {
  try {
    const storageRef = ref(storage(), `backups/${filename}`);
    const bytes = await getBytes(storageRef);
    const decoder = new TextDecoder('utf-8');
    const jsonStr = decoder.decode(bytes);
    const backupData = JSON.parse(jsonStr) as Record<string, any[]>;

    for (const colName of Object.keys(backupData)) {
      const docs = backupData[colName];
      try {
        const oldSnap = await getDocs(collection(db(), colName));
        for (const oldDoc of oldSnap.docs) {
          if (oldDoc.id !== '_init_placeholder') {
            await deleteDoc(oldDoc.ref);
          }
        }
        for (const docData of docs) {
          const { id, ...data } = docData;
          if (id && id !== '_init_placeholder') {
            await setDoc(doc(db(), colName, id), data);
          }
        }
      } catch (err) {
        console.warn(`Restore error in collection ${colName}:`, err);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Database restore failed:', error);
    throw new Error(error.message || 'Failed to restore database from backup.');
  }
};

export const getNotificationDashboardData = async (): Promise<NotificationDashboardData> => {
  try {
    const tokensColl = collection(db(), FIRESTORE_NOTIFICATION_TOKENS_COLLECTION);
    const countSnapshot = await getCountFromServer(tokensColl);
    const totalDevices = countSnapshot.data().count;

    const statsColl = collection(db(), 'notification_stats');
    const statsQuery = query(statsColl, orderBy('updatedAt', 'desc'), limit(30));
    const statsSnapshot = await getDocs(statsQuery);
    const stats = statsSnapshot.docs.map(docDoc => ({
      date: docDoc.id,
      sent: docDoc.data().sent || 0,
      failed: docDoc.data().failed || 0,
      removedTokens: docDoc.data().removedTokens || 0,
      updatedAt: docDoc.data().updatedAt || ''
    }));

    return {
      success: true,
      totalDevices,
      stats
    };
  } catch (error) {
    console.warn('Direct Firestore get notification dashboard failed:', error);
    throw error;
  }
};

export const logoutAdmin = async (): Promise<void> => {
  try {
    const authInstance = auth();
    await signOut(authInstance);
  } catch (err) {
    console.warn('Firebase Auth sign out failed:', err);
  }
  StorageService.clearAdminSession();
};

export const compressYearlySalesSummary = async (): Promise<{ success: boolean; deletedCount: number; summaryId?: string }> => {
  try {
    const ordersSnap = await getDocs(collection(db(), FIRESTORE_ORDERS_COLLECTION));
    const allOrders = ordersSnap.docs.map(docDoc => docDoc.data() as Order);
    
    const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
    const oldOrders = allOrders.filter(o => {
      const orderTime = o.receivedAt ? Date.parse(o.receivedAt) : Date.parse(o.date);
      return !isNaN(orderTime) && orderTime < oneYearAgo;
    });

    if (oldOrders.length === 0) {
      return { success: true, deletedCount: 0 };
    }

    let totalRevenue = 0;
    const itemDemand: Record<string, number> = {};
    let minDate = oldOrders[0].date;
    let maxDate = oldOrders[0].date;

    for (const order of oldOrders) {
      totalRevenue += order.total;
      if (order.date < minDate) minDate = order.date;
      if (order.date > maxDate) maxDate = order.date;

      for (const item of order.items) {
        itemDemand[item.name] = (itemDemand[item.name] || 0) + item.quantity;
      }
    }

    const summaryId = `yearly_summary_${new Date().getFullYear()}_${Date.now()}`;
    const summaryData = {
      id: summaryId,
      createdAt: new Date().toISOString(),
      compressedOrdersCount: oldOrders.length,
      totalRevenue,
      itemDemand,
      periodStart: minDate,
      periodEnd: maxDate,
    };

    await setDoc(doc(db(), 'yearlySummaries', summaryId), summaryData);

    let deletedCount = 0;
    for (const order of oldOrders) {
      await deleteDoc(doc(db(), FIRESTORE_ORDERS_COLLECTION, order.id));
      try {
        await deleteDoc(doc(db(), 'orderHistory', order.id));
      } catch (err) {}
      deletedCount++;
    }

    return { success: true, deletedCount, summaryId };
  } catch (error: any) {
    console.error('Yearly summary compression failed:', error);
    throw new Error(error.message || 'Failed to compress yearly summary.');
  }
};

export const getLegacyCustomersFromServer = async (): Promise<any[]> => {
  const legacyList: any[] = [];
  
  // 1. Fetch from legacyCustomers collection
  try {
    const snap1 = await getDocs(collection(db(), 'legacyCustomers'));
    snap1.forEach((docSnap) => {
      legacyList.push({ ...docSnap.data(), id: docSnap.id, source: 'legacyCustomers' });
    });
  } catch (err) {
    console.warn('Failed to fetch from legacyCustomers:', err);
  }

  // 2. Fetch from customers collection where ID starts with cust_ or legacyUser is true
  try {
    const snap2 = await getDocs(collection(db(), FIRESTORE_CUSTOMERS_COLLECTION));
    snap2.forEach((docSnap) => {
      const id = docSnap.id;
      const data = docSnap.data() as any;
      if (id.startsWith('cust_') || data.legacyUser === true) {
        const phone = id.replace('cust_', '').replace(/\D/g, '');
        if (!legacyList.some((x) => x.phone === phone || x.mobileNumber === phone || x.id === phone)) {
          legacyList.push({ ...data, id, source: 'customers' });
        }
      }
    });
  } catch (err) {
    console.warn('Failed to fetch from customers for legacy:', err);
  }

  // Map to structured objects
  const mappedList = await Promise.all(legacyList.map(async (c) => {
    const rawPhone = c.phone || c.mobileNumber || c.id || '';
    const phone = rawPhone.replace('cust_', '').replace(/\D/g, '');
    const name = c.name || c.fullName || `Customer_${phone.slice(-4)}`;
    const verified = c.verified === true || c.status === 'verified';
    const walletBalance = c.walletBalance ?? c.balance ?? c.rewardPoints ?? c.coins ?? 0;
    const referralCode = c.referralCode || '';
    
    let ordersCount = 0;
    try {
      const q1 = query(collection(db(), FIRESTORE_ORDERS_COLLECTION), where('customerId', '==', phone));
      const count1 = await getCountFromServer(q1);
      const q2 = query(collection(db(), 'orderHistory'), where('customerId', '==', phone));
      const count2 = await getCountFromServer(q2);
      
      const q1_legacy = query(collection(db(), FIRESTORE_ORDERS_COLLECTION), where('customerId', '==', 'cust_' + phone));
      const count1_legacy = await getCountFromServer(q1_legacy);
      const q2_legacy = query(collection(db(), 'orderHistory'), where('customerId', '==', 'cust_' + phone));
      const count2_legacy = await getCountFromServer(q2_legacy);
      
      ordersCount = count1.data().count + count2.data().count + count1_legacy.data().count + count2_legacy.data().count;
    } catch (err) {
      console.warn('Error counting orders:', err);
    }

    return {
      id: c.id,
      name,
      phone,
      verified,
      walletBalance,
      referralCode,
      ordersCount,
      source: c.source,
      raw: c
    };
  }));

  return mappedList;
};

export const importLegacyCustomer = async (legacyCust: any): Promise<void> => {
  const phone = legacyCust.phone;
  const name = legacyCust.name;
  const verified = legacyCust.verified;
  const walletBalance = legacyCust.walletBalance;
  let referralCode = legacyCust.referralCode;
  
  if (verified && !referralCode) {
    referralCode = await generateUniqueReferralCode();
  }
  
  const nowStr = new Date().toISOString();
  const customerProfile: CustomerProfile = {
    id: phone,
    customerId: phone,
    name,
    fullName: name,
    phone,
    mobileNumber: phone,
    loginMethod: 'phone',
    verified,
    walletBalance,
    loyaltyPoints: walletBalance,
    rewardPoints: walletBalance,
    active: true,
    status: 'active',
    createdAt: legacyCust.raw?.createdAt || nowStr,
    lastLogin: nowStr,
    referralAttemptsRemaining: 3,
    referralCodeUsed: legacyCust.raw?.referralCodeUsed || false,
    referralLocked: false,
    referralCode,
    legacyUser: false
  };

  // Recreate profile in both collections
  await setDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, phone), customerProfile);
  await setDoc(doc(db(), 'customerProfiles', phone), customerProfile);
  
  // Wallet
  await setDoc(doc(db(), 'wallets', phone), {
    customerId: phone,
    balance: walletBalance,
    createdAt: nowStr
  }, { merge: true });
  
  // History
  await setDoc(doc(db(), 'customerHistory', phone), {
    customerId: phone,
    createdAt: nowStr
  }, { merge: true });

  // Verification request
  await setDoc(doc(db(), 'customerVerificationRequests', phone), {
    requestId: phone,
    customerId: phone,
    customerName: name,
    mobileNumber: phone,
    otp: 'NO_OTP',
    status: verified ? 'verified' : 'pending',
    createdAt: nowStr,
    verifiedAt: verified ? nowStr : null,
    verifiedBy: verified ? 'admin' : null
  }, { merge: true });

  // Update legacy orders from 'cust_phone' to 'phone'
  try {
    const q1 = query(collection(db(), FIRESTORE_ORDERS_COLLECTION), where('customerId', '==', 'cust_' + phone));
    const snap1 = await getDocs(q1);
    for (const docSnap of snap1.docs) {
      await updateDoc(docSnap.ref, { customerId: phone });
    }
  } catch (e) {
    console.warn('Failed to update customerId in orders:', e);
  }
  try {
    const q2 = query(collection(db(), 'orderHistory'), where('customerId', '==', 'cust_' + phone));
    const snap2 = await getDocs(q2);
    for (const docSnap of snap2.docs) {
      await updateDoc(docSnap.ref, { customerId: phone });
    }
  } catch (e) {
    console.warn('Failed to update customerId in orderHistory:', e);
  }

  // Delete legacy customer document
  if (legacyCust.id.startsWith('cust_')) {
    try {
      await deleteDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, legacyCust.id));
    } catch (e) {}
  }
  if (legacyCust.source === 'legacyCustomers') {
    try {
      await deleteDoc(doc(db(), 'legacyCustomers', legacyCust.id));
    } catch (e) {}
  }
};

export const rejectLegacyCustomer = async (legacyCust: any): Promise<void> => {
  if (legacyCust.source === 'legacyCustomers') {
    await deleteDoc(doc(db(), 'legacyCustomers', legacyCust.id));
  } else if (legacyCust.id.startsWith('cust_')) {
    await deleteDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, legacyCust.id));
  } else {
    // Standard phone customer, update status
    await updateDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, legacyCust.id), { status: 'rejected', active: false });
    try {
      await updateDoc(doc(db(), 'customerProfiles', legacyCust.id), { status: 'rejected', active: false });
    } catch (e) {}
  }
};

export const changeAccountPassword = async (
  requesterUsername: string,
  targetUsername: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  // 1. Verify requester is Admin
  const adminDoc = await getDoc(doc(db(), 'admins', requesterUsername));
  if (!adminDoc.exists()) {
    throw new Error('Unauthorized: Only Admin can change passwords.');
  }

  // 2. Identify target collection
  let targetCollection = '';
  if (targetUsername === 'Admin_Harinos') {
    targetCollection = 'admins';
  } else if (targetUsername === 'Manager_Harinos') {
    targetCollection = 'managers';
  } else if (targetUsername === 'Staff_Harinos') {
    targetCollection = 'staff';
  } else {
    const snapA = await getDoc(doc(db(), 'admins', targetUsername));
    if (snapA.exists()) targetCollection = 'admins';
    else {
      const snapM = await getDoc(doc(db(), 'managers', targetUsername));
      if (snapM.exists()) targetCollection = 'managers';
      else {
        const snapS = await getDoc(doc(db(), 'staff', targetUsername));
        if (snapS.exists()) targetCollection = 'staff';
      }
    }
  }

  if (!targetCollection) {
    throw new Error('Target user not found.');
  }

  const targetDocRef = doc(db(), targetCollection, targetUsername);
  const targetSnap = await getDoc(targetDocRef);
  if (!targetSnap.exists()) {
    throw new Error('Target account not found.');
  }

  const targetData = targetSnap.data();
  const currentHash = await hashPasswordClient(currentPassword);
  
  if (targetData.passwordHash !== currentHash && targetData.password !== currentPassword) {
    throw new Error('Incorrect current password.');
  }

  const newHash = await hashPasswordClient(newPassword);
  await updateDoc(targetDocRef, { passwordHash: newHash, password: newPassword });

  // Update in Firebase Auth if it corresponds to the current logged in user
  const authInstance = auth();
  const def = DEFAULT_STAFF.find((d) => d.username === targetUsername);
  if (def && authInstance.currentUser && authInstance.currentUser.email === def.email) {
    try {
      await updateAuthPassword(authInstance.currentUser, newPassword);
    } catch (err) {
      console.warn('Failed to update password in Firebase Auth:', err);
    }
  }
};

export const repairMissingCustomerProfiles = async (): Promise<void> => {
  try {
    const custSnap = await getDocs(collection(db(), FIRESTORE_CUSTOMERS_COLLECTION));
    const customers = custSnap.docs
      .map(d => ({ id: d.id, ...d.data() }) as CustomerProfile)
      .filter(c => c.id !== '_init_placeholder');

    const profSnap = await getDocs(collection(db(), 'customerProfiles'));
    const profilesMap = new Map(profSnap.docs.map(d => [d.id, d.data()]));

    for (const customer of customers) {
      const profile = profilesMap.get(customer.id);
      if (!profile) {
        console.log(`Auto-repairing missing profile for customer: ${customer.id}`);
        const newProfile: CustomerProfile = {
          ...customer,
          legacyUser: false
        };
        await setDoc(doc(db(), 'customerProfiles', customer.id), newProfile);
        
        const walletRef = doc(db(), 'wallets', customer.id);
        const walletSnap = await getDoc(walletRef);
        if (!walletSnap.exists()) {
          await setDoc(walletRef, {
            customerId: customer.id,
            balance: customer.walletBalance || 0,
            createdAt: customer.createdAt || new Date().toISOString()
          });
        }
      }
    }

    for (const [profId, profData] of profilesMap.entries()) {
      if (profId === '_init_placeholder') continue;
      const custExists = customers.some(c => c.id === profId);
      if (!custExists) {
        console.log(`Auto-repairing missing customer record for profile: ${profId}`);
        await setDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, profId), profData);
      }
    }
  } catch (err) {
    console.warn('Error in repairMissingCustomerProfiles:', err);
  }
};

export const getReferredCustomers = async (referralCode: string): Promise<CustomerProfile[]> => {
  if (!referralCode) return [];
  const q = query(collection(db(), FIRESTORE_CUSTOMERS_COLLECTION), where('referredBy', '==', referralCode));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as CustomerProfile);
};

export const regenerateReferralCodeForCustomer = async (customerId: string): Promise<string> => {
  const cleanId = customerId.trim();
  const code = await generateUniqueReferralCode();
  
  await updateDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanId), { referralCode: code });
  try {
    await updateDoc(doc(db(), 'customerProfiles', cleanId), { referralCode: code });
  } catch (e) {}
  
  return code;
};

export const disableReferralCodeForCustomer = async (customerId: string): Promise<void> => {
  const cleanId = customerId.trim();
  
  await updateDoc(doc(db(), FIRESTORE_CUSTOMERS_COLLECTION, cleanId), { referralCode: '' });
  try {
    await updateDoc(doc(db(), 'customerProfiles', cleanId), { referralCode: '' });
  } catch (e) {}
};
