import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';

type OrderStatus = 'new' | 'preparing' | 'ready' | 'out_for_delivery' | 'done' | 'cancelled';

type CustomerProfile = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loginMethod: 'email' | 'phone';
  verified?: boolean;
  createdAt: string;
};

type OrderPayload = {
  id: string;
  items: unknown[];
  total: number;
  date: string;
  receivedAt?: string;
  status?: OrderStatus;
  [key: string]: unknown;
};

const parseServiceAccount = (): admin.ServiceAccount => {
  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (encoded) {
    return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8')) as admin.ServiceAccount;
  }

  if (raw) {
    return JSON.parse(raw) as admin.ServiceAccount;
  }

  throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_BASE64.');
};

const getFirestore = (): admin.firestore.Firestore => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(parseServiceAccount()),
      projectId: process.env.FIREBASE_PROJECT_ID || 'harinos-12902',
    });
  }

  return admin.firestore();
};

const sendError = (res: VercelResponse, error: unknown) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: error instanceof Error ? error.message : 'Internal server error.',
  });
};

const getPath = (req: VercelRequest): string => {
  const url = new URL(req.url ?? '/', 'https://harinos.local');
  return url.pathname.replace(/^\/api\/?/, '/');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const db = getFirestore();
    const path = getPath(req);

    if (req.method === 'GET' && path === '/health') {
      res.json({ success: true, storageDriver: 'firebase', projectId: process.env.FIREBASE_PROJECT_ID || 'harinos-12902' });
      return;
    }

    if (req.method === 'GET' && path === '/orders') {
      const snapshot = await db.collection('orders').orderBy('receivedAt', 'desc').limit(500).get();
      res.json({ success: true, orders: snapshot.docs.map((doc) => doc.data()) });
      return;
    }

    if (req.method === 'POST' && path === '/orders/full') {
      const order = req.body as Partial<OrderPayload>;
      if (!order.id || !Array.isArray(order.items)) {
        res.status(400).json({ success: false, message: 'Invalid order payload.' });
        return;
      }

      const nextOrder: OrderPayload = {
        ...(order as OrderPayload),
        receivedAt: order.receivedAt ?? new Date().toISOString(),
        status: order.status ?? 'new',
      };
      await db.collection('orders').doc(nextOrder.id).set(nextOrder, { merge: true });
      res.status(201).json({ success: true, orderId: nextOrder.id });
      return;
    }

    const statusMatch = path.match(/^\/orders\/([^/]+)\/status$/);
    if (req.method === 'PATCH' && statusMatch) {
      const status = (req.body as { status?: OrderStatus }).status;
      if (!status) {
        res.status(400).json({ success: false, message: 'Missing status.' });
        return;
      }
      await db.collection('orders').doc(decodeURIComponent(statusMatch[1])).set(
        {
          status,
          statusUpdatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
      res.json({ success: true });
      return;
    }

    if (req.method === 'GET' && path === '/customers') {
      const snapshot = await db.collection('customers').orderBy('createdAt', 'desc').limit(500).get();
      res.json({ success: true, customers: snapshot.docs.map((doc) => doc.data()) });
      return;
    }

    if (req.method === 'POST' && path === '/customers') {
      const profile = req.body as Partial<CustomerProfile>;
      if (!profile.id || !profile.name || !profile.phone) {
        res.status(400).json({ success: false, message: 'Invalid customer profile.' });
        return;
      }

      await db.collection('customers').doc(profile.id).set(profile, { merge: true });
      res.status(201).json({ success: true, customer: profile });
      return;
    }

    const verifyMatch = path.match(/^\/customers\/([^/]+)\/verify$/);
    if (req.method === 'PATCH' && verifyMatch) {
      await db.collection('customers').doc(decodeURIComponent(verifyMatch[1])).set({ verified: true }, { merge: true });
      res.json({ success: true });
      return;
    }

    res.status(404).json({ success: false, message: `API route not found: ${path}` });
  } catch (error) {
    sendError(res, error);
  }
}
