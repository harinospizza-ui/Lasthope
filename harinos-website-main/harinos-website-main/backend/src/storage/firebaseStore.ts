import admin from 'firebase-admin';
import { config } from '../config.js';
import { CustomerProfile, FullOrderPayload, OrderStatus } from '../types.js';
import { OrderStore, newestOrdersFirst } from './store.js';

let firestore: admin.firestore.Firestore | null = null;

const withTimeout = async <T,>(operation: Promise<T>, label: string): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} timed out. Confirm Firestore is enabled for project ${config.firebase.projectId}.`));
    }, 10000);
  });

  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

const getFirestore = (): admin.firestore.Firestore => {
  if (!firestore) {
    if (!admin.apps.length) {
      if (!config.firebase.serviceAccount) {
        throw new Error('Firebase storage selected, but FIREBASE_SERVICE_ACCOUNT_BASE64 or FIREBASE_SERVICE_ACCOUNT_JSON is missing.');
      }

      admin.initializeApp({
        credential: admin.credential.cert(config.firebase.serviceAccount as admin.ServiceAccount),
        projectId: config.firebase.projectId || undefined,
      });
    }

    firestore = admin.firestore();
  }

  return firestore;
};

export const firebaseStore: OrderStore = {
  name: 'firebase',

  async getOrders() {
    const snapshot = await withTimeout(
      getFirestore().collection('orders').orderBy('receivedAt', 'desc').get(),
      'Fetching orders from Firebase',
    );
    return newestOrdersFirst(snapshot.docs.map((doc) => doc.data() as FullOrderPayload));
  },

  async saveOrder(order) {
    const nextOrder: FullOrderPayload = {
      ...order,
      receivedAt: order.receivedAt ?? new Date().toISOString(),
      status: order.status ?? 'new',
    };
    await withTimeout(
      getFirestore().collection('orders').doc(nextOrder.id).set(nextOrder, { merge: true }),
      'Saving order to Firebase',
    );
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    await withTimeout(
      getFirestore().collection('orders').doc(orderId).set({ status }, { merge: true }),
      'Updating order status in Firebase',
    );
  },

  async getCustomers() {
    const snapshot = await withTimeout(
      getFirestore().collection('customers').orderBy('createdAt', 'desc').get(),
      'Fetching customers from Firebase',
    );
    return snapshot.docs.map((doc) => doc.data() as CustomerProfile);
  },

  async saveCustomer(profile) {
    await withTimeout(
      getFirestore().collection('customers').doc(profile.id).set(profile, { merge: true }),
      'Saving customer to Firebase',
    );
  },

  async verifyCustomer(customerId) {
    const ref = getFirestore().collection('customers').doc(customerId);
    const snap = await withTimeout(ref.get(), 'Reading customer from Firebase');
    if (!snap.exists) return null;
    const customer = { ...(snap.data() as CustomerProfile), verified: true };
    await withTimeout(ref.set(customer, { merge: true }), 'Verifying customer in Firebase');
    return customer;
  },
};
