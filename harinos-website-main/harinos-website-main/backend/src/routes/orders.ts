import { Router } from 'express';
import { CustomerProfile, FullOrderPayload, OrderStatus } from '../types.js';
import { getOrderStore } from '../storage/index.js';
import {
  sendNotificationToRole,
  sendNotificationToCustomer,
} from '../services/fcmService.js';

const router = Router();

router.get('/orders', async (_req, res, next) => {
  try {
    res.json({ success: true, orders: await getOrderStore().getOrders() });
  } catch (error) {
    next(error);
  }
});

router.post('/orders/full', async (req, res, next) => {
  try {
    const order = req.body as Partial<FullOrderPayload>;
    if (!order.id || !Array.isArray(order.items)) {
      res.status(400).json({ success: false, message: 'Invalid order.' });
      return;
    }

    const fullOrder = {
      ...order,
      receivedAt: order.receivedAt ?? new Date().toISOString(),
      status: order.status ?? 'new',
    } as FullOrderPayload;

    await getOrderStore().saveOrder(fullOrder);

    // Send notifications to all admins, managers, and staff
    const itemSummary = fullOrder.items
      .slice(0, 2)
      .map((item: any) => `${item.quantity || 1}x ${item.name || 'Item'}`)
      .join(', ');
    const additionalInfo = fullOrder.items.length > 2 ? `+${fullOrder.items.length - 2} more` : '';
    const itemText = `${itemSummary}${additionalInfo ? ' ' + additionalInfo : ''}`;

    // Notify admins (all outlets)
    void sendNotificationToRole('NEW_ORDER', order.id!, 'admin', undefined, {
      itemSummary: itemText,
      orderType: fullOrder.orderType,
      total: String(Math.round(fullOrder.total)),
    }).catch((err) => console.error('Error notifying admins:', err));

    // Notify managers for the outlet
    if (fullOrder.outletId) {
      void sendNotificationToRole('NEW_ORDER', order.id!, 'manager', fullOrder.outletId, {
        itemSummary: itemText,
        orderType: fullOrder.orderType,
      }).catch((err) => console.error('Error notifying managers:', err));

      // Notify staff for the outlet
      void sendNotificationToRole('NEW_ORDER', order.id!, 'staff', fullOrder.outletId, {
        itemSummary: itemText,
        orderType: fullOrder.orderType,
      }).catch((err) => console.error('Error notifying staff:', err));
    }

    res.status(201).json({ success: true, orderId: order.id });
  } catch (error) {
    next(error);
  }
});

router.post('/orders', async (req, res, next) => {
  try {
    const payload = req.body as {
      orderId?: string;
      items?: unknown[];
      total?: number;
      orderType?: string;
      createdAt?: string;
      outlet?: { id?: string; name?: string; phone?: string; address?: string };
      [key: string]: unknown;
    };

    if (!payload.orderId || !Array.isArray(payload.items)) {
      res.status(400).json({ success: false, message: 'Invalid order payload.' });
      return;
    }

    await getOrderStore().saveOrder({
      id: payload.orderId,
      items: payload.items,
      total: payload.total ?? 0,
      date: payload.createdAt ?? new Date().toISOString(),
      receivedAt: payload.createdAt ?? new Date().toISOString(),
      orderType: payload.orderType ?? 'takeaway',
      deliveryFee: payload.deliveryFee ?? 0,
      outletId: payload.outlet?.id,
      outletName: payload.outlet?.name,
      outletPhone: payload.outlet?.phone,
      outletAddress: payload.outlet?.address,
      customerLocationUrl: String(payload.location ?? ''),
      distanceKm: typeof payload.distanceKm === 'number' ? payload.distanceKm : null,
      status: 'new',
    } as FullOrderPayload);

    res.status(201).json({ success: true, orderId: payload.orderId });
  } catch (error) {
    next(error);
  }
});

router.patch('/orders/:orderId/status', async (req, res, next) => {
  try {
    const status = (req.body as { status?: OrderStatus }).status;
    if (!status) {
      res.status(400).json({ success: false, message: 'Missing status.' });
      return;
    }

    await getOrderStore().updateOrderStatus(req.params.orderId, status);

    // Send customer notifications only for certain status changes
    const customerNotifiableStatuses: OrderStatus[] = ['preparing', 'ready', 'out_for_delivery', 'done', 'cancelled'];
    if (customerNotifiableStatuses.includes(status)) {
      // Get order details to find customer
      const orders = await getOrderStore().getOrders();
      const order = orders.find((o) => (o as any).id === req.params.orderId);

      if (order && (order as any).customerName) {
        // Customer ID could be phone number or email
        const customerId = (order as any).customerPhone || (order as any).customerEmail || (order as any).customerName;

        // Map order status to notification event type
        const eventTypeMap: Record<OrderStatus, any> = {
          new: null,
          preparing: 'PREPARING',
          ready: 'READY',
          out_for_delivery: 'OUT_FOR_DELIVERY',
          done: 'DONE',
          cancelled: 'CANCELLED',
        };

        const eventType = eventTypeMap[status];
        if (eventType && customerId) {
          void sendNotificationToCustomer(eventType, req.params.orderId, customerId).catch((err) =>
            console.error('Error notifying customer:', err),
          );
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.get('/customers', async (_req, res, next) => {
  try {
    res.json({ success: true, customers: await getOrderStore().getCustomers() });
  } catch (error) {
    next(error);
  }
});

router.post('/customers', async (req, res, next) => {
  try {
    const profile = req.body as Partial<CustomerProfile>;
    if (!profile.id || !profile.name || !profile.phone) {
      res.status(400).json({ success: false, message: 'Invalid customer profile.' });
      return;
    }

    await getOrderStore().saveCustomer(profile as CustomerProfile);
    res.status(201).json({ success: true, customer: profile });
  } catch (error) {
    next(error);
  }
});

router.patch('/customers/:customerId/verify', async (req, res, next) => {
  try {
    const customer = await getOrderStore().verifyCustomer(req.params.customerId);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found.' });
      return;
    }

    res.json({ success: true, customer });
  } catch (error) {
    next(error);
  }
});

export default router;
