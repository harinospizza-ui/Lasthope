import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { verifyToken } from '../../cryptoUtils.js';

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

type OrderStatus = 'new' | 'preparing' | 'ready' | 'out_for_delivery' | 'done' | 'cancelled';
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
    case 'PREPARING':
      return {
        notification: {
          title: 'Order Confirmed',
          body: `Your order #${orderId.split('-')[2] || orderId.slice(-5)} is being prepared`,
        },
        data: baseData,
      };
    case 'READY':
      return {
        notification: {
          title: '✨ Order Ready',
          body: `Your order #${orderId.split('-')[2] || orderId.slice(-5)} is ready for pickup`,
        },
        data: baseData,
      };
    case 'OUT_FOR_DELIVERY':
      return {
        notification: {
          title: '📍 On the Way',
          body: `Your order #${orderId.split('-')[2] || orderId.slice(-5)} is out for delivery`,
        },
        data: baseData,
      };
    case 'DONE':
      return {
        notification: {
          title: '✅ Order Completed',
          body: `Your order #${orderId.split('-')[2] || orderId.slice(-5)} has been completed. Thank you!`,
        },
        data: baseData,
      };
    case 'CANCELLED':
      return {
        notification: {
          title: '❌ Order Cancelled',
          body: `Your order #${orderId.split('-')[2] || orderId.slice(-5)} has been cancelled`,
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

const sendNotificationToCustomer = async (
  eventType: NotificationEventType,
  orderId: string,
  customerId: string,
  additionalData?: Record<string, string>,
) => {
  try {
    const db = getFirestore();
    const messaging = admin.messaging();

    const tokensSnapshot = await db
      .collection('notification_tokens')
      .where('userId', '==', customerId)
      .where('role', '==', 'customer')
      .where('isActive', '==', true)
      .get();

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

    return { sent, failed };
  } catch (error) {
    console.error('Error sending customer notification:', error);
    return { sent: 0, failed: 0 };
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'PATCH') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const { orderId } = req.query as { orderId: string };
  if (!orderId) {
    res.status(400).json({ success: false, message: 'Missing order ID.' });
    return;
  }

  try {
    const db = getFirestore();
    const caller = authenticateRequest(req);
    if (!caller) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const { status, reason } = req.body as { status?: OrderStatus; reason?: string };
    if (!status) {
      res.status(400).json({ success: false, message: 'Missing status.' });
      return;
    }
    if (status === 'cancelled' && !reason) {
      res.status(400).json({ success: false, message: 'Cancellation reason is required.' });
      return;
    }
    
    // Staff cannot cancel orders
    if (status === 'cancelled' && caller.role !== 'admin' && caller.role !== 'manager') {
      res.status(403).json({ success: false, message: 'Forbidden. Staff cannot cancel orders.' });
      return;
    }

    const orderRef = db.collection('orders').doc(decodeURIComponent(orderId));
    const snap = await orderRef.get();
    if (!snap.exists) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const order = snap.data() as any;
    const previousStatus = order.status || 'new';

    const processOrderStatusUpdate = (orderData: any) => {
      orderData.status = status;
      orderData.statusUpdatedAt = new Date().toISOString();
      orderData.updatedBy = caller.username;
      if (status === 'cancelled') {
        orderData.cancelledBy = caller.username;
        orderData.cancellationReason = reason;
      }
      if (!orderData.auditTrail) orderData.auditTrail = [];
      orderData.auditTrail.push({
        timestamp: new Date().toISOString(),
        updatedBy: caller.username,
        action: `Status changed from ${previousStatus} to ${status}`,
        previousStatus,
        newStatus: status,
        reason: reason || ''
      });
      return orderData;
    };

    const updated = processOrderStatusUpdate(order);
    await orderRef.set(updated, { merge: true });

    if (status === 'cancelled') {
      await logSecurityEvent('ORDER_CANCELLED', caller.username, `Order: ${orderId}, Reason: ${reason}`);
    }
    
    // Dispatch FCM notifications
    const customerNotifiableStatuses = ['preparing', 'ready', 'out_for_delivery', 'done', 'cancelled'];
    if (customerNotifiableStatuses.includes(status)) {
      const customerId = updated.customerPhone || updated.customerEmail || updated.customerName;
      const eventTypeMap: Record<OrderStatus, NotificationEventType | null> = {
        new: null,
        preparing: 'PREPARING',
        ready: 'READY',
        out_for_delivery: 'OUT_FOR_DELIVERY',
        done: 'DONE',
        cancelled: 'CANCELLED',
      };
      const eventType = eventTypeMap[status];
      if (eventType && customerId) {
        const addData = status === 'cancelled' ? { reason: reason || '' } : undefined;
        void sendNotificationToCustomer(eventType, orderId, customerId, addData).catch((err) =>
          console.error('Error sending customer status FCM:', err)
        );
      }
    }

    if (status === 'cancelled') {
      void sendNotificationToRole('CANCELLED', orderId, 'admin', undefined, { reason: reason || '' }).catch((err) =>
        console.error('Error notifying admin of cancellation:', err)
      );
      if (updated.outletId) {
        void sendNotificationToRole('CANCELLED', orderId, 'manager', updated.outletId, { reason: reason || '' }).catch((err) =>
          console.error('Error notifying manager of cancellation:', err)
        );
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error.',
    });
  }
}
