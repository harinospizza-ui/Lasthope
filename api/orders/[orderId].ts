import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { verifyToken } from '../cryptoUtils.js';

const getJWTSecret = (): string => {
  return process.env.JWT_SECRET || 'dev-harinos-pizza-secret-key-32-chars-minimum';
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
    const serviceAccount = parseServiceAccount();
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || 'harinos-12902',
    });
  }
  return admin.firestore();
};

const authenticateRequest = (req: VercelRequest): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  return verifyToken(token, getJWTSecret());
};

const logSecurityEvent = async (action: string, username: string, details: string, ip?: string) => {
  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    action,
    username,
    details,
    ip: ip || 'unknown'
  };
  try {
    const db = getFirestore();
    await db.collection('security_logs').doc(logEntry.id).set(logEntry);
  } catch (err) {
    console.error('Failed to log security event:', err);
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const { orderId } = req.query as { orderId: string };
  if (!orderId) {
    res.status(400).json({ success: false, message: 'Missing order ID.' });
    return;
  }

  try {
    const db = getFirestore();
    const orderRef = db.collection('orders').doc(decodeURIComponent(orderId));
    const snap = await orderRef.get();

    if (!snap.exists) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const order = snap.data() as any;

    if (req.method === 'GET') {
      if (order.isDeleted) {
        res.status(404).json({ success: false, message: 'Order not found.' });
        return;
      }
      // Strip financial info for staff callers
      const caller = authenticateRequest(req);
      if (caller && caller.role === 'staff') {
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

      res.json({ success: true, order });
      return;
    }

    if (req.method === 'DELETE') {
      const caller = authenticateRequest(req);
      if (!caller) {
        res.status(401).json({ success: false, message: 'Unauthorized.' });
        return;
      }

      if (caller.role !== 'admin' && caller.role !== 'manager') {
        res.status(403).json({ success: false, message: 'Forbidden. Admin or Manager role required to delete.' });
        return;
      }

      const updated = {
        ...order,
        isDeleted: true,
        deletedBy: caller.username,
        deletedAt: new Date().toISOString(),
        auditTrail: [
          ...(order.auditTrail || []),
          {
            timestamp: new Date().toISOString(),
            updatedBy: caller.username,
            action: 'Order soft deleted'
          }
        ]
      };

      await orderRef.set(updated, { merge: true });
      await logSecurityEvent('ORDER_DELETED', caller.username, `Soft deleted order: ${orderId}`);
      res.json({ success: true, message: 'Order deleted successfully.' });
      return;
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error.',
    });
  }
}
