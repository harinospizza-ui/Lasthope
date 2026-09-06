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
let isFirstOfferRun = true;
let isFirstOrderRun = true;

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
 * Handle order status transitions and fire user-facing system notifications
 */
export const handleOrderStatusUpdate = (order: Order, isInitialSnapshot = false) => {
  if (!order || !order.id || !order.status) return;

  const orderId = order.id;
  const newStatus = order.status;
  const previousStatus = knownOrderStatuses.get(orderId) || localStorage.getItem(`harinos_order_status_${orderId}`);

  // Update known status
  knownOrderStatuses.set(orderId, newStatus);
  localStorage.setItem(`harinos_order_status_${orderId}`, newStatus);
  trackedOrderIds.add(orderId);

  // If this is the initial load of an already completed or cancelled order, don't replay past notifications
  if (isInitialSnapshot && (newStatus === 'done' || newStatus === 'cancelled')) {
    return;
  }

  // If status actually changed or is a fresh new order
  if (previousStatus !== newStatus) {
    console.log(`[NotificationEngine] Order ${orderId} status changed from "${previousStatus}" to "${newStatus}"`);
    NotificationService.notifyOrderStatus(orderId, newStatus, {
      orderType: order.orderType || 'delivery',
      customerName: order.customerName,
      total: order.total,
    });
  }
};

/**
 * Watch active customer orders in real-time
 */
const watchOrders = (phone?: string, customerId?: string) => {
  try {
    const firestore = db();

    // 1. Listen to past orders stored in local cache
    const pastOrders = StorageService.getPastOrders();
    pastOrders.slice(0, 5).forEach((order) => {
      if (!order.id) return;
      trackedOrderIds.add(order.id);
      const unsub = onSnapshot(
        doc(firestore, 'orders', order.id),
        (snap) => {
          if (!snap.exists()) return;
          const data = snap.data() as Order;
          handleOrderStatusUpdate({ ...data, id: snap.id }, isFirstOrderRun);
        },
        (err) => console.warn(`[NotificationEngine] Order ${order.id} listener notice:`, err)
      );
      activeUnsubscribes.push(unsub);
    });

    // 2. Query Firestore orders matching customer phone if available
    if (phone && phone.trim().length >= 10) {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const q = query(
        collection(firestore, 'orders'),
        where('customerPhone', '>=', cleanPhone),
        where('customerPhone', '<=', cleanPhone + '\uf8ff'),
        limit(10)
      );

      const unsub = onSnapshot(
        q,
        (snap) => {
          snap.docChanges().forEach((change) => {
            const data = change.doc.data() as Order;
            const fullOrder = { ...data, id: change.doc.id };
            handleOrderStatusUpdate(fullOrder, change.type === 'added' && isFirstOrderRun);
          });
          isFirstOrderRun = false;
        },
        (err) => console.warn('[NotificationEngine] Customer phone orders query notice:', err)
      );
      activeUnsubscribes.push(unsub);
    }
  } catch (err) {
    console.warn('[NotificationEngine] Watch orders init notice:', err);
  }
};

/**
 * Watch customer profile for wallet and reward coin balance changes in real-time
 */
const watchWalletAndCoins = (customerId?: string, phone?: string) => {
  if (!customerId && !phone) return;

  try {
    const firestore = db();
    const docId = customerId || phone;
    if (!docId) return;

    const unsubProfile = onSnapshot(
      doc(firestore, 'customers', docId),
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data() as CustomerProfile;

        const currentBalance = typeof data.walletBalance === 'number' ? data.walletBalance : 0;
        const currentPoints = typeof data.rewardPoints === 'number' ? data.rewardPoints : 0;

        // Check wallet balance changes
        if (lastWalletBalance !== null) {
          const diff = currentBalance - lastWalletBalance;
          if (diff > 0) {
            console.log(`[NotificationEngine] Wallet credited by ₹${diff}`);
            NotificationService.notifyWalletUpdate('credit', diff, currentBalance, 'Top-up / payment update!');
          } else if (diff < 0) {
            // Only notify if not a local checkout within 5s
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

    // Also watch wallet_transactions for new top-ups
    const qTx = query(
      collection(firestore, 'wallet_transactions'),
      where('customerId', '==', docId),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const unsubTx = onSnapshot(
      qTx,
      (snap) => {
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
 * Watch offers collection in real-time
 */
const watchOffers = () => {
  try {
    const firestore = db();
    const unsub = onSnapshot(
      collection(firestore, 'offers'),
      (snap) => {
        const offers = snap.docs.map((d) => ({ ...d.data(), id: d.id } as OfferCard));

        offers.forEach((offer) => {
          if (!offer || !offer.id || !offer.enabled) return;

          // If this is a newly discovered offer that wasn't previously known
          if (!knownOfferIds.has(offer.id)) {
            knownOfferIds.add(offer.id);
            if (!isFirstOfferRun) {
              console.log(`[NotificationEngine] New offer broadcast: ${offer.offerTitle}`);
              NotificationService.show(
                `🔥 New Offer: ${offer.offerTitle}`,
                offer.offerDescription || offer.description || 'Check out our latest pizza specials today!',
                offer.image || '/icon-192.png',
                'warning',
                `offer-${offer.id}`
              );
            }
          }
        });

        isFirstOfferRun = false;
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
 * Calling this ensures that enabling notifications is 100% sufficient to receive
 * order status, wallet balance, and offer notifications in real time.
 */
export const startNotificationEngine = (profile?: CustomerProfile | null): (() => void) => {
  if (isEngineStarted) {
    stopNotificationEngine();
  }

  isEngineStarted = true;
  initializeLocalCache();

  const phone = profile?.phone || StorageService.getCustomerProfile()?.phone;
  const customerId = profile?.id || StorageService.getCustomerProfile()?.id;

  // 1. Watch orders
  watchOrders(phone, customerId);

  // 2. Watch wallet & coins
  watchWalletAndCoins(customerId, phone);

  // 3. Watch offers
  watchOffers();

  console.log('[NotificationEngine] Real-time engine started for:', customerId || 'guest');

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