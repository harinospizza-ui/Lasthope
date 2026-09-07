import { getOfferNotificationMessage, getOfferReleaseSignature } from '../utils/offerUtils';
import { OfferCard } from '../types';
import { getNotificationPermission, safeStorage } from './browserSupport';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const DEFAULT_ICON = '/icon-192.png';
const OFFER_RELEASE_KEY = 'harinos_offer_release_signature';

// Synthesize pleasant melodic notification chimes using Web Audio API
const playChime = (tone: 'order' | 'wallet' | 'offer' | 'status' = 'order') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    let baseFreq = 523.25; // C5
    if (tone === 'wallet') baseFreq = 659.25; // E5
    if (tone === 'offer') baseFreq = 587.33; // D5
    if (tone === 'status') baseFreq = 698.46; // F5

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.15);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 1.25, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2, now + 0.28);

    gainNode.gain.setValueAtTime(0.25, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.08);
    osc1.stop(now + 0.28);
    osc2.stop(now + 0.45);
  } catch {
    // Audio context may be restricted without prior user interaction
  }
};

export const NotificationService = {
  requestPermission: async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('This browser does not support push notifications');
      return false;
    }

    let permission = Notification.permission;
    if (permission === 'default') {
      try {
        permission = await Notification.requestPermission();
      } catch (err) {
        console.warn('Notification permission request error:', err);
      }
    }

    if (permission === 'granted') {
      // Ensure Service Worker is registered immediately
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        } catch (e) {
          console.warn('SW registration notice:', e);
        }
      }
      return true;
    }

    return false;
  },

  show: async (
    title: string,
    body: string,
    icon?: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    tag?: string
  ) => {
    // 1. Play auditory chime
    playChime(type === 'success' ? 'wallet' : 'order');

    // 2. Trigger native haptic vibration if running via Capacitor
    if (Capacitor.isNativePlatform()) {
      try {
        Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
      } catch {}
    }

    // 3. Send system notification outside the app (Notification shade / Lockscreen / Action Center)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const options = {
        body,
        icon: icon || DEFAULT_ICON,
        badge: DEFAULT_ICON,
        vibrate: [400, 200, 400, 200, 400],
        tag: tag || `harinos-${Date.now()}`,
        requireInteraction: false,
        renotify: true,
        data: { url: '/' },
      };

      let shown = false;

      // Method A: Direct Service Worker showNotification (works on Android Chrome and iOS PWA)
      if ('serviceWorker' in navigator) {
        try {
          let reg = await navigator.serviceWorker.getRegistration();
          if (!reg) {
            reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
          }
          if (reg) {
            await reg.showNotification(title, options);
            shown = true;
          }
        } catch (swErr) {
          try {
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg?.active) {
              reg.active.postMessage({
                type: 'SHOW_NOTIFICATION',
                title,
                options,
              });
              shown = true;
            }
          } catch {}
        }
      }

      // Method B: Native desktop browser notification fallback
      if (!shown) {
        try {
          new Notification(title, options);
        } catch (e) {
          console.warn('Native notification notice:', e);
        }
      }
    }
  },

  sendTestNotification: async (): Promise<boolean> => {
    const granted = await NotificationService.requestPermission();
    if (granted) {
      await NotificationService.show(
        '🔔 Notifications Active!',
        'You will now receive instant alerts for your orders, wallet balance, and special offers.',
        DEFAULT_ICON,
        'success',
        'test-notification'
      );
      return true;
    }
    return false;
  },

  notifyOrderStatus: (
    orderId: string,
    status: string,
    options?: { customerName?: string; orderType?: string; total?: number }
  ) => {
    const cleanId = orderId ? orderId.slice(-6).toUpperCase() : 'ORDER';
    const type = options?.orderType || 'delivery';

    switch (status) {
      case 'new':
        NotificationService.show(
          `🍕 Order Received (#${cleanId})`,
          "We've received your order! The Harino's kitchen is preparing to cook it fresh.",
          DEFAULT_ICON,
          'success',
          `order-${orderId}`
        );
        break;

      case 'preparing':
        NotificationService.show(
          `👨‍🍳 Preparing Your Fresh Order (#${cleanId})`,
          'The kitchen is actively baking your pizza and prepping your delicious food right now!',
          DEFAULT_ICON,
          'info',
          `order-${orderId}`
        );
        break;

      case 'ready':
        NotificationService.show(
          `✅ Hot & Ready! (#${cleanId})`,
          type === 'delivery'
            ? 'Your order is freshly prepared and packaged, ready for delivery rider pickup!'
            : 'Your order is hot and ready at the counter! Please collect your meal.',
          DEFAULT_ICON,
          'success',
          `order-${orderId}`
        );
        break;

      case 'out_for_delivery':
        NotificationService.show(
          `🚗 Out for Delivery! (#${cleanId})`,
          'Our delivery partner is on the way to your location with your steaming hot food!',
          DEFAULT_ICON,
          'warning',
          `order-${orderId}`
        );
        break;

      case 'done':
        NotificationService.show(
          `🎉 Order Delivered (#${cleanId})`,
          'Thank you for ordering with Harino\'s! Enjoy your meal.',
          DEFAULT_ICON,
          'success',
          `order-${orderId}`
        );
        break;

      case 'cancelled':
        NotificationService.show(
          `❌ Order Cancelled (#${cleanId})`,
          `Order #${cleanId} has been cancelled. Any applied wallet or coin balance has been restored.`,
          DEFAULT_ICON,
          'error',
          `order-${orderId}`
        );
        break;

      default:
        NotificationService.show(
          `Order Update (#${cleanId})`,
          `Your order status is now: ${status}`,
          DEFAULT_ICON,
          'info',
          `order-${orderId}`
        );
    }
  },

  notifyWalletUpdate: (
    changeType: 'credit' | 'debit' | 'reward',
    amount: number,
    newBalance: number,
    notes?: string
  ) => {
    if (changeType === 'credit') {
      NotificationService.show(
        '💰 Harino\'s Wallet Credited!',
        `₹${Math.round(amount)} has been credited to your wallet! ${notes || ''} Current Balance: ₹${Math.round(newBalance)}.`,
        DEFAULT_ICON,
        'success',
        `wallet-credit-${Date.now()}`
      );
    } else if (changeType === 'debit') {
      NotificationService.show(
        '💳 Harino\'s Wallet Payment',
        `₹${Math.round(amount)} paid from your wallet for your order. Remaining Balance: ₹${Math.round(newBalance)}.`,
        DEFAULT_ICON,
        'info',
        `wallet-debit-${Date.now()}`
      );
    } else if (changeType === 'reward') {
      NotificationService.show(
        '🌟 Reward Coins Earned!',
        `+${amount} Harino\'s coins earned! Total Reward Coins: ${newBalance}.`,
        DEFAULT_ICON,
        'success',
        `wallet-reward-${Date.now()}`
      );
    }
  },

  notifyOffer: (title: string, description: string, image?: string) => {
    NotificationService.show(
      `🔥 Special Offer: ${title}`,
      description,
      image || DEFAULT_ICON,
      'warning',
      `offer-${Date.now()}`
    );
  },

  notifyOfferReleases: (offers: OfferCard[], options?: { force?: boolean }) => {
    const notifiableOffers = offers.filter((offer) => offer.enabled && offer.notifyCustomers);
    if (!notifiableOffers.length) return;

    const currentSignature = getOfferReleaseSignature(notifiableOffers);
    const previousSignature = safeStorage.getItem(window.localStorage, OFFER_RELEASE_KEY);

    if (!options?.force && previousSignature === currentSignature) {
      return;
    }

    notifiableOffers.forEach((offer, index) => {
      window.setTimeout(() => {
        NotificationService.show(
          `🔥 New Offer: ${offer.offerTitle}`,
          getOfferNotificationMessage(offer),
          offer.image || DEFAULT_ICON,
          'warning',
          `offer-${offer.id || index}`
        );
      }, index * 1200);
    });

    safeStorage.setItem(window.localStorage, OFFER_RELEASE_KEY, currentSignature);
  },

  simulateOrderStatus: (orderId: string, type: 'takeaway' | 'delivery') => {
    NotificationService.notifyOrderStatus(orderId, 'new', { orderType: type });
    window.setTimeout(() => {
      NotificationService.notifyOrderStatus(orderId, 'preparing', { orderType: type });
    }, 15000);
    window.setTimeout(() => {
      NotificationService.notifyOrderStatus(orderId, type === 'delivery' ? 'out_for_delivery' : 'ready', { orderType: type });
    }, 35000);
  },
};
