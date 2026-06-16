import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, updateDoc, doc, getDocs } from 'firebase/firestore';
import { getFirebaseApp } from './firebaseClient';
import { Notification, Order, OrderStatus } from '../types';

const NOTIFICATIONS_COLLECTION = 'notifications';

const statusMessages = {
  new: 'Your order has been received!',
  preparing: 'Your order is being prepared',
  ready: 'Your order is ready for pickup!',
  out_for_delivery: 'Your order is on the way!',
  done: 'Your order has been delivered!',
  cancelled: 'Your order has been cancelled',
};

const notificationTitles = {
  new: '🍕 Order Received',
  preparing: '👨‍🍳 Preparing Your Order',
  ready: '✅ Order Ready',
  out_for_delivery: '🚗 On the Way',
  done: '🎉 Order Complete',
  cancelled: '❌ Order Cancelled',
};

const getMessageForStaff = (status: OrderStatus, order: Order): string => {
  const statusMap = {
    new: `New order #${order.id} - ${order.customerName} - Rs ${Math.round(order.total)}`,
    preparing: `Order #${order.id} marked as preparing`,
    ready: `Order #${order.id} ready for ${order.orderType}`,
    out_for_delivery: `Order #${order.id} out for delivery to ${order.customerName}`,
    done: `Order #${order.id} completed`,
    cancelled: `Order #${order.id} cancelled`,
  };
  return statusMap[status] || `Order status: ${status}`;
};

export const sendNotification = async (
  orderId: string,
  userId: string,
  userType: 'admin' | 'manager' | 'staff' | 'customer',
  status: OrderStatus,
  order: Order,
): Promise<void> => {
  try {
    const db = getFirestore(getFirebaseApp());
    const message =
      userType === 'customer'
        ? statusMessages[status]
        : getMessageForStaff(status, order);
    const title =
      userType === 'customer'
        ? notificationTitles[status]
        : `Order #${order.id} - ${userType.toUpperCase()}`;

    const notificationData: Omit<Notification, 'id'> = {
      orderId,
      userId,
      userType,
      title,
      message,
      status,
      timestamp: new Date().toISOString(),
      read: false,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
    };

    // Save to Firestore
    await addDoc(
      collection(db, NOTIFICATIONS_COLLECTION),
      notificationData,
    );

    // Send browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: `order-${orderId}`,
          requireInteraction: userType !== 'customer',
        });
      } catch (error) {
        console.error('Browser notification failed:', error);
      }
    }

    console.log(`Notification sent to ${userType}:`, message);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const notifyStaffNewOrder = async (
  order: Order,
  outletId: string | null,
): Promise<void> => {
  try {
    // Notify all staff and managers at this outlet
    const staffUserIds = [
      'admin_staff_all', // Special ID for all staff notifications
      'manager_staff_all',
      `outlet_${outletId}_staff`,
    ];

    for (const userId of staffUserIds) {
      await sendNotification(order.id, userId, 'staff', 'new', order);
    }

    // Also notify manager and admin
    await sendNotification(order.id, 'admin_user', 'admin', 'new', order);
    await sendNotification(order.id, 'manager_user', 'manager', 'new', order);
  } catch (error) {
    console.error('Error notifying staff:', error);
  }
};

export const notifyCustomerStatusChange = async (
  order: Order,
  status: OrderStatus,
): Promise<void> => {
  try {
    const customerId = order.customerPhone || order.customerEmail || order.id;
    await sendNotification(order.id, customerId, 'customer', status, order);
  } catch (error) {
    console.error('Error notifying customer:', error);
  }
};

export const subscribeToNotifications = (
  userId: string,
  userType: 'admin' | 'manager' | 'staff' | 'customer',
  callback: (notifications: Notification[]) => void,
): (() => void) | null => {
  try {
    const db = getFirestore(getFirebaseApp());
    let q;

    if (userType === 'staff') {
      // Staff sees: admin_staff_all, manager_staff_all, outlet_XXX_staff
      q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userType', 'in', ['staff', 'admin', 'manager']),
        orderBy('timestamp', 'desc'),
      );
    } else if (userType === 'customer') {
      q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userId', '==', userId),
        where('userType', '==', 'customer'),
        orderBy('timestamp', 'desc'),
      );
    } else {
      q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userId', 'in', [userId, `${userType}_user`, `${userType}_staff_all`]),
        orderBy('timestamp', 'desc'),
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Notification, 'id'>),
        id: doc.id,
      })) as Notification[];

      callback(notifications.slice(0, 50)); // Keep last 50 notifications
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    return null;
  }
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<void> => {
  try {
    const db = getFirestore(getFirebaseApp());
    const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(notificationRef, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const getRecentNotifications = async (
  userId: string,
  limit: number = 20,
): Promise<Notification[]> => {
  try {
    const db = getFirestore(getFirebaseApp());
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({
        ...(doc.data() as Omit<Notification, 'id'>),
        id: doc.id,
      }))
      .slice(0, limit) as Notification[];
  } catch (error) {
    console.error('Error getting recent notifications:', error);
    return [];
  }
};
