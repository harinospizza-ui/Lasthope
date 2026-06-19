import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { verifyToken } from './cryptoUtils.js';

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

type NotificationRole = 'admin' | 'manager' | 'staff' | 'customer';
type NotificationEventType = 'NEW_ORDER' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DONE' | 'CANCELLED';

const buildNotificationMessage = (
  eventType: NotificationEventType,
  orderId: string,
  additionalData?: Record<string, string>,
) => {
  const baseData = {
    orderId,
    eventType,
    timestamp: new Date().toISOString(),
    ...additionalData,
  };

  switch (eventType) {
    case 'NEW_ORDER':
      return {
        notification: {
          title: '🍕 New Order Received',
          body: `Order #${orderId.split('-')[2] || orderId.slice(-5)} is waiting to be prepared`,
        },
        data: baseData,
      };
    default:
      return {
        notification: {
          title: 'Order Update',
          body: `Update for order #${orderId.split('-')[2] || orderId.slice(-5)}`,
        },
        data: baseData,
      };
  }
};

const logNotificationEvent = async (
  eventType: NotificationEventType,
  orderId: string,
  role: NotificationRole,
  outletId: string | undefined,
  sent: number,
  failed: number,
) => {
  try {
    const db = getFirestore();
    await db.collection('notification_log').add({
      eventType,
      orderId,
      role,
      outletId: outletId || 'all',
      sent,
      failed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Warning: Failed to log notification event', error);
  }
};

const sendNotificationToRole = async (
  eventType: NotificationEventType,
  orderId: string,
  role: NotificationRole,
  outletId?: string,
  additionalData?: Record<string, string>,
) => {
  try {
    const db = getFirestore();
    const messaging = admin.messaging();

    let query: admin.firestore.Query = db
      .collection('notification_tokens')
      .where('role', '==', role)
      .where('isActive', '==', true);

    if (outletId) {
      query = query.where('outletId', '==', outletId);
    }

    const tokensSnapshot = await query.get();
    const tokens = tokensSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as any);

    if (tokens.length === 0) {
      return { sent: 0, failed: 0 };
    }

    const message = buildNotificationMessage(eventType, orderId, additionalData);
    let sent = 0;
    let failed = 0;

    for (const token of tokens) {
      try {
        await messaging.send({
          token: token.fcmToken,
          ...message,
        });
        sent++;
      } catch (error) {
        failed++;
        const errorMsg = error instanceof Error ? error.message : '';
        if (
          errorMsg.includes('unregistered') ||
          errorMsg.includes('invalid') ||
          errorMsg.includes('not-registered')
        ) {
          if (token.id) {
            await db.collection('notification_tokens').doc(token.id).update({ isActive: false });
          }
        }
      }
    }

    await logNotificationEvent(eventType, orderId, role, outletId, sent, failed);
    return { sent, failed };
  } catch (error) {
    console.error('Error sending notifications:', error);
    return { sent: 0, failed: 0 };
  }
};

const sendNewOrderNotifications = async (order: any) => {
  try {
    const db = getFirestore();
    const items = order.items || [];
    const itemSummary = items.slice(0, 2).map((it: any) => `${it.quantity || 1}x ${it.name}`).join(', ');
    const additional = items.length > 2 ? ` +${items.length - 2} more` : '';
    const itemText = `${itemSummary}${additional}`;

    const activeOrdersSnap = await db.collection('orders')
      .where('status', 'in', ['new', 'preparing', 'ready', 'out_for_delivery'])
      .get();
    
    const activeOrders = activeOrdersSnap.docs.map(doc => doc.data());
    const adminPendingCount = activeOrders.length;
    const outletPendingCount = order.outletId ? activeOrders.filter(o => o.outletId === order.outletId).length : adminPendingCount;

    await sendNotificationToRole('NEW_ORDER', order.id, 'admin', undefined, {
      itemSummary: itemText,
      orderType: order.orderType || 'takeaway',
      total: String(Math.round(order.total || 0)),
      pendingCount: String(adminPendingCount),
    });

    if (order.outletId) {
      await sendNotificationToRole('NEW_ORDER', order.id, 'manager', order.outletId, {
        itemSummary: itemText,
        orderType: order.orderType || 'takeaway',
        pendingCount: String(outletPendingCount),
      });

      await sendNotificationToRole('NEW_ORDER', order.id, 'staff', order.outletId, {
        itemSummary: itemText,
        orderType: order.orderType || 'takeaway',
        pendingCount: String(outletPendingCount),
      });
    }
  } catch (err) {
    console.error('Error sending new order notifications:', err);
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const db = getFirestore();

    if (req.method === 'GET') {
      const caller = authenticateRequest(req);
      if (!caller) {
        res.status(401).json({ success: false, message: 'Unauthorized.' });
        return;
      }

      const filterOrdersByRole = (ordersList: any[]) => {
        let result = ordersList;
        if (caller.role === 'staff') {
          result = result.filter(o => !o.isDeleted && (caller.outletId ? o.outletId === caller.outletId : true));
          result = result.map(o => {
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
        } else if (caller.role === 'manager') {
          result = result.filter(o => !o.isDeleted);
        }
        return result;
      };

      const snapshot = await db.collection('orders').orderBy('receivedAt', 'desc').limit(500).get();
      const rawOrders = snapshot.docs.map((doc) => doc.data());
      const filtered = filterOrdersByRole(rawOrders);
      res.json({ success: true, orders: filtered });
      return;
    }

    if (req.method === 'POST') {
      const order = req.body as any;
      if (!Array.isArray(order.items)) {
        res.status(400).json({ success: false, message: 'Invalid order payload: items list is required.' });
        return;
      }

      // Generate server-side order ID using a sequential number matching today's date
      const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const todayFormatted = todayStr.replace(/-/g, ''); // YYYYMMDD
      const startOfDay = new Date(todayStr + 'T00:00:00.000Z');

      const snapshot = await db.collection('orders')
        .where('receivedAt', '>=', startOfDay.toISOString())
        .get();
      const dailySeq = snapshot.size + 1;
      const orderId = `HRN-${todayFormatted}-${dailySeq}`;

      const nextOrder = {
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
      };

      await db.collection('orders').doc(orderId).set(nextOrder);
      
      // Send background new order FCM alerts to admin/manager/staff
      void sendNewOrderNotifications(nextOrder).catch((err) => console.error('Error notifying new order:', err));

      res.status(201).json({ success: true, order: nextOrder });
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
