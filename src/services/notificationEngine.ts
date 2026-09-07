import { collection, doc, onSnapshot, query, where, orderBy, limit, Unsubscribe } from 'firebase/firestore';
import { db } from './firebaseClient';
import { NotificationService } from './notification';
import { StorageService } from './storage';
import type { CustomerProfile, Order, OfferCard } from '../types';

let isEngineStarted = false;
const activeUnsubscribes: Unsubscribe[] = [];
const trackedOrderIds = new Set<string>();
const knownOrderStatuses = new Map<string, string>();
let lastWalletBalance: number | null = null;
let lastRewardPoints: number | null = null;
const knownOfferIds = new Set<string>();

const normalizePhone = (phone?: string): string => {
  if (!phone) return '';
  return phone.replace(/\D/g, '').slice(-10);
};

/**
 * Validate whether an order strictly belongs to the current customer/device.
 * Prevents receiving notifications for any other user's order modifications.
 */
const isOrderForCurrentCustomer = (
  order: Order,
  currentCustomerId?: string,
  currentPhone?: string,
  localOrderIds?: Set<string>
): boolean => {
  if (!order || !order.id) return false;

  // 1. Order placed on this device / stored in local history
  if (localOrderIds && localOrderIds.has(order.id)) {
    return true;
  }
  if (trackedOrderIds.has(order.id)) {
    return true;
  }

  // 2. Customer ID matches current logged in profile
  if (currentCustomerId && order.customerId && order.customerId === currentCustomerId) {
    return true;
  }

  // 3. Customer phone matches current logged in profile phone (normalized 10 digits)
  const normCurrentPhone = normalizePhone(currentPhone);
  if (normCurrentPhone && normCurrentPhone.length >= 10) {
    const normOrderPhone = normalizePhone(order.customerPhone);
    if (normOrderPhone && normOrderPhone === normCurrentPhone) {
      return true;
    }
    const normOrderCustId = normalizePhone(order.customerId);
    if (normOrderCustId && normOrderCustId === normCurrentPhone) {
      return true;
    }
  }

  return false;
};

/**
 * Initialize existing cached state to avoid spamming historical alerts on boot
 */
const initializeLocalCache = () => {
  try {
    const pastOrders = StorageService.getPastOrders();
    pastOrders.forEach((o) => {
      if (o.id && o.status) {
        trackedOrderIds.add(o.id);
        const cached = localStorage.getItem(`harinos_order_status_${o.id}`);
        knownOrderStatuses.set(o.id, cached || o.status);
      }
    });

    const profile = StorageService.getCustomerProfile();
    if (profile) {
      if (typeof profile.walletBalance === 'number') {
        const stored = localStorage.getItem('harinos_last_wallet_balance');
        lastWalletBalance = stored !== null ? parseFloat(stored) : profile.walletBalance;
      }
      if (typeof profile.rewardPoints === 'number') {
        const stored = localStorage.getItem('harinos_last_reward_points');
        lastRewardPoints = stored !== null ? parseFloat(stored) : profile.rewardPoints;
      }
    }

    const cachedOffers = localStorage.getItem('cached_offers');
    if (cachedOffers) {
      try {
        const parsed: OfferCard[] = JSON.parse(cachedOffers);
        parsed.forEach((offer) => {
          if (offer.id) knownOfferIds.add(offer.id);
        });
      } catch {}
    }
  } catch (err) {
    console.warn('[NotificationEngine] Cache init notice:', err);
  }
};

/**
 * Handle order status transitions and fire external system push notifications.
 * Strictly verifies user ownership and ignores initial snapshots.
 */
export const handleOrderStatusUpdate = (
  order: Order,
  isInitialSnapshot: boolean,
  currentCustomerId?: string,
  currentPhone?: string,
  localOrderIds?: Set<string>
) => {
  if (!order || !order.id || !order.status) return;

  // STRICT USER ISOLATION: Discard if order does not belong to this customer
  if (!isOrderForCurrentCustomer(order, currentCustomerId, currentPhone, localOrderIds)) {
    return;
  }

  const orderId = order.id;
  const newStatus = order.status;
  const previousStatus = knownOrderStatuses.get(orderId) || localStorage.getItem(`harinos_order_status_${orderId}`);

  // Update known status in memory and cache
  knownOrderStatuses.set(orderId, newStatus);
  localStorage.setItem(`harinos_order_status_${orderId}`, newStatus);
  trackedOrderIds.add(orderId);
  if (localOrderIds) localOrderIds.add(orderId);

  // On initial load / boot, NEVER trigger notifications for existing orders in DB
  if (isInitialSnapshot) {
    return;
  }

  // Only notify when status actually transitioned from one state to another (e.g. new -> preparing -> ready -> out_for_delivery)
  if (previousStatus && previousStatus !== newStatus) {
    console.log(`[NotificationEngine] Order ${orderId} status changed from "${previousStatus}" to "${newStatus}"`);
    NotificationService.notifyOrderStatus(orderId, newStatus, {
      orderType: order.orderType || 'delivery',
      customerName: order.customerName,
      total: order.total,
    });
  }
};

/**
 * Watch active customer orders in real-time.
 * Only subscribes to the user's specific past orders and exact customer identifier queries.
 */
const watchOrders = (currentPhone?: string, currentCustomerId?: string) => {
  try {
    const firestore = db();
    const localOrderIds = new Set<string>();

    // 1. Listen directly to specific past orders stored in local cache
    const pastOrders = StorageService.getPastOrders();
    pastOrders.slice(0, 10).forEach((order) => {
      if (!order.id) return;
      localOrderIds.add(order.id);
      trackedOrderIds.add(order.id);
      const cached = localStorage.getItem(`harinos_order_status_${order.id}`);
      if (cached) knownOrderStatuses.set(order.id, cached);
      else if (order.status) knownOrderStatuses.set(order.id, order.status);

      let isFirstDocRun = true;
      const unsub = onSnapshot(
        doc(firestore, 'orders', order.id),
        (snap) => {
          if (!snap.exists()) return;
          const data = snap.data() as Order;
          handleOrderStatusUpdate({ ...data, id: snap.id }, isFirstDocRun, currentCustomerId, currentPhone, localOrderIds);
          isFirstDocRun = false;
        },
        (err) => console.warn(`[NotificationEngine] Order ${order.id} listener notice:`, err)
      );
      activeUnsubscribes.push(unsub);
    });

    // 2. Query Firestore orders matching exact customerId if logged in
    if (currentCustomerId && currentCustomerId !== '_init_placeholder') {
      let isFirstQueryRun = true;
      const qCust = query(
        collection(firestore, 'orders'),
        where('customerId', '==', currentCustomerId),
        orderBy('receivedAt', 'desc'),
        limit(5)
      );

      const unsubCust = onSnapshot(
        qCust,
        (snap) => {
          snap.docChanges().forEach((change) => {
            const data = change.doc.data() as Order;
            const fullOrder = { ...data, id: change.doc.id };
            handleOrderStatusUpdate(fullOrder, isFirstQueryRun, currentCustomerId, currentPhone, localOrderIds);
          });
          isFirstQueryRun = false;
        },
        (err) => console.warn('[NotificationEngine] Customer ID orders query notice:', err)
      );
      activeUnsubscribes.push(unsubCust);
    }

    // 3. Query Firestore orders matching exact 10-digit customerPhone
    const cleanPhone = normalizePhone(currentPhone);
    if (cleanPhone && cleanPhone.length >= 10) {
      let isFirstPhoneRun = true;
      const qPhone = query(
        collection(firestore, 'orders'),
        where('customerPhone', '==', cleanPhone),
        limit(5)
      );

      const unsubPhone = onSnapshot(
        qPhone,
        (snap) => {
          snap.docChanges().forEach((change) => {
            const data = change.doc.data() as Order;
            const fullOrder = { ...data, id: change.doc.id };
            handleOrderStatusUpdate(fullOrder, isFirstPhoneRun, currentCustomerId, currentPhone, localOrderIds);
          });
          isFirstPhoneRun = false;
        },
        (err) => console.warn('[NotificationEngine] Customer phone orders query notice:', err)
      );
      activeUnsubscribes.push(unsubPhone);

      // Also support phone with country code prefix (+91)
      let isFirstIntlRun = true;
      const qIntl = query(
        collection(firestore, 'orders'),
        where('customerPhone', '==', '+91' + cleanPhone),
        limit(5)
      );
      const unsubIntl = onSnapshot(
        qIntl,
        (snap) => {
          snap.docChanges().forEach((change) => {
            const data = change.doc.data() as Order;
            const fullOrder = { ...data, id: change.doc.id };
            handleOrderStatusUpdate(fullOrder, isFirstIntlRun, currentCustomerId, currentPhone, localOrderIds);
          });
          isFirstIntlRun = false;
        },
        () => {}
      );
      activeUnsubscribes.push(unsubIntl);
    }
  } catch (err) {
    console.warn('[NotificationEngine] Watch orders init notice:', err);
  }
};

/**
 * Watch customer profile for wallet and reward coin balance changes in real-time.
 * Strictly checks the current customer document and prevents boot spam.
 */
const watchWalletAndCoins = (customerId?: string, phone?: string) => {
  const docId = customerId || phone;
  if (!docId) return;

  try {
    const firestore = db();
    let isFirstProfileRun = true;

    const unsubProfile = onSnapshot(
      doc(firestore, 'customers', docId),
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data() as CustomerProfile;

        const currentBalance = typeof data.walletBalance === 'number' ? data.walletBalance : 0;
        const currentPoints = typeof data.rewardPoints === 'number' ? data.rewardPoints : 0;

        if (isFirstProfileRun) {
          isFirstProfileRun = false;
          lastWalletBalance = currentBalance;
          lastRewardPoints = currentPoints;
          localStorage.setItem('harinos_last_wallet_balance', String(currentBalance));
          localStorage.setItem('harinos_last_reward_points', String(currentPoints));
          return; // Do NOT notify on initial boot
        }

        // Check wallet balance changes
        if (lastWalletBalance !== null) {
          const diff = currentBalance - lastWalletBalance;
          if (diff > 0) {
            console.log(`[NotificationEngine] Wallet credited by ₹${diff}`);
            NotificationService.notifyWalletUpdate('credit', diff, currentBalance, 'Top-up / payment update!');
          } else if (diff < 0) {
            // Only notify if not a local checkout within 7s
            const recentCheckout = sessionStorage.getItem('harinos_recent_checkout_time');
            const isJustNow = recentCheckout && (Date.now() - parseInt(recentCheckout, 10)) < 7000;
            if (!isJustNow) {
              NotificationService.notifyWalletUpdate('debit', Math.abs(diff), currentBalance);
            }
          }
        }
        lastWalletBalance = currentBalance;
        localStorage.setItem('harinos_last_wallet_balance', String(currentBalance));

        // Check reward points changes
        if (lastRewardPoints !== null) {
          const pointsDiff = currentPoints - lastRewardPoints;
          if (pointsDiff > 0) {
            console.log(`[NotificationEngine] Reward coins credited by +${pointsDiff}`);
            NotificationService.notifyWalletUpdate('reward', pointsDiff, currentPoints);
          }
        }
        lastRewardPoints = currentPoints;
        localStorage.setItem('harinos_last_reward_points', String(currentPoints));
      },
      (err) => console.warn('[NotificationEngine] Wallet profile listener notice:', err)
    );
    activeUnsubscribes.push(unsubProfile);

    // Also watch wallet_transactions strictly for this customer's completed top-ups
    let isFirstTxRun = true;
    const qTx = query(
      collection(firestore, 'wallet_transactions'),
      where('customerId', '==', docId),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const unsubTx = onSnapshot(
      qTx,
      (snap) => {
        if (isFirstTxRun) {
          isFirstTxRun = false;
          snap.docs.forEach((d) => {
            localStorage.setItem(`harinos_notified_tx_${d.id}`, 'true');
          });
          return; // Seed existing transactions without alert
        }

        snap.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const tx = change.doc.data();
            const txKey = `harinos_notified_tx_${change.doc.id}`;
            if (!localStorage.getItem(txKey) && tx.status === 'completed') {
              localStorage.setItem(txKey, 'true');
              NotificationService.show(
                '💰 Wallet Top-up Approved!',
                `₹${tx.amount} has been added to your Harino's wallet. Happy ordering! 🍕`,
                '/icon-192.png',
                'success'
              );
            }
          }
        });
      },
      () => {}
    );
    activeUnsubscribes.push(unsubTx);
  } catch (err) {
    console.warn('[NotificationEngine] Watch wallet init notice:', err);
  }
};

/**
 * Watch offers collection in real-time.
 * Worldwide broadcast to all users when a new offer is published.
 */
const watchOffers = () => {
  try {
    const firestore = db();
    let isFirstOffersRun = true;

    const unsub = onSnapshot(
      collection(firestore, 'offers'),
      (snap) => {
        const offers = snap.docs.map((d) => ({ ...d.data(), id: d.id } as OfferCard));

        if (isFirstOffersRun) {
          isFirstOffersRun = false;
          offers.forEach((offer) => {
            if (offer && offer.id) knownOfferIds.add(offer.id);
          });
          return; // Seed existing offers on boot without alert
        }

        offers.forEach((offer) => {
          if (!offer || !offer.id || !offer.enabled) return;

          // If this is a newly discovered offer that wasn't previously known
          if (!knownOfferIds.has(offer.id)) {
            knownOfferIds.add(offer.id);
            console.log(`[NotificationEngine] New offer broadcast: ${offer.offerTitle}`);
            NotificationService.show(
              `🔥 New Offer: ${offer.offerTitle}`,
              offer.offerDescription || offer.description || 'Check out our latest pizza specials today!',
              offer.image || '/icon-192.png',
              'warning',
              `offer-${offer.id}`
            );
          }
        });
      },
      (err) => console.warn('[NotificationEngine] Offers listener notice:', err)
    );
    activeUnsubscribes.push(unsub);
  } catch (err) {
    console.warn('[NotificationEngine] Watch offers init notice:', err);
  }
};

/**
 * Start the unified real-time Notification Engine.
 * Ensures strict user isolation for orders and wallet updates,
 * while keeping offers broadcast worldwide, and routing notifications
 * outside the app via system/device notifications.
 */
export const startNotificationEngine = (profile?: CustomerProfile | null): (() => void) => {
  if (isEngineStarted) {
    stopNotificationEngine();
  }

  isEngineStarted = true;
  initializeLocalCache();

  const phone = profile?.phone || StorageService.getCustomerProfile()?.phone;
  const customerId = profile?.id || StorageService.getCustomerProfile()?.id;

  // 1. Watch orders (strictly for current customer)
  watchOrders(phone, customerId);

  // 2. Watch wallet & coins (strictly for current customer)
  watchWalletAndCoins(customerId, phone);

  // 3. Watch offers (worldwide broadcast)
  watchOffers();

  console.log('[NotificationEngine] Real-time engine started for:', customerId || phone || 'guest');

  return stopNotificationEngine;
};

/**
 * Stop and clean up all listeners
 */
export const stopNotificationEngine = () => {
  activeUnsubscribes.forEach((unsub) => {
    try {
      unsub();
    } catch {}
  });
  activeUnsubscribes.length = 0;
  isEngineStarted = false;
};