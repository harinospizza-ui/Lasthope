// Unified Service Worker for Harino's Pizza (PWA, Push Notifications & Background Alerts)

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((cacheKey) => caches.delete(cacheKey)));
      await self.clients.claim();
    })(),
  );
});

// BroadcastChannel for instant background thread synchronization
let broadcastChannel = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    broadcastChannel = new BroadcastChannel('harinos_background_sync');
    broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        displayNotification(event.data.title, event.data.options);
      }
    };
  }
} catch (e) {
  // BroadcastChannel fallback
}

function displayNotification(title, options) {
  return self.registration.showNotification(title || "Harino's Pizza", {
    body: options?.body || '',
    icon: options?.icon || '/icon-192.png',
    badge: options?.badge || '/icon-192.png',
    tag: options?.tag || `harinos-${Date.now()}`,
    data: options?.data || {},
    vibrate: options?.vibrate || [500, 250, 500, 250, 500],
    requireInteraction: options?.requireInteraction || false,
    renotify: options?.renotify !== false,
    actions: options?.actions || [
      { action: 'open', title: 'Open Harinos', icon: '/icon-192.png' },
      { action: 'track', title: 'Track Order', icon: '/icon-192.png' },
    ],
  });
}

/**
 * Handle direct postMessage from client / background service
 */
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    event.waitUntil(displayNotification(title, options));
  } else if (event.data.type === 'HEARTBEAT') {
    // Keep-alive acknowledge
    if (event.source && 'postMessage' in event.source) {
      event.source.postMessage({ type: 'HEARTBEAT_ACK', timestamp: Date.now() });
    }
  }
});

/**
 * Handle Periodic Background Sync (Android Chrome / Modern PWA)
 */
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'harinos-order-sync') {
    console.log('[SW] Periodic background sync triggered');
    event.waitUntil(
      (async () => {
        const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        clientList.forEach((client) => {
          client.postMessage({ type: 'BACKGROUND_PERIODIC_CHECK', timestamp: Date.now() });
        });
      })(),
    );
  }
});

/**
 * Handle One-Off Background Sync
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'harinos-sync-orders') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(
      (async () => {
        const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        clientList.forEach((client) => {
          client.postMessage({ type: 'BACKGROUND_SYNC_TRIGGER', timestamp: Date.now() });
        });
      })(),
    );
  }
});

/**
 * Handle push notifications from Firebase Cloud Messaging or Web Push
 */
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.warn('Push event received without data');
    return;
  }

  let payload = {};
  try {
    payload = event.data.json();
  } catch (error) {
    try {
      payload = { title: "Harino's Pizza", body: event.data.text() };
    } catch {
      console.error('Error parsing push notification data:', error);
      return;
    }
  }

  const notification = payload.notification || {};
  const data = payload.data || {};
  const notifTitle = notification.title || data.title || payload.title || "Harino's Pizza";
  const notifBody = notification.body || data.body || payload.body || "You have an update from Harino's";

  const options = {
    body: notifBody,
    icon: notification.icon || data.icon || '/icon-192.png',
    badge: notification.badge || data.badge || '/icon-192.png',
    tag: data?.tag || notification.tag || `harinos-${Date.now()}`,
    data: data,
    vibrate: [500, 250, 500, 250, 500],
    requireInteraction: false,
    renotify: true,
    actions: [
      {
        action: 'open',
        title: 'Open',
        icon: '/icon-192.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192.png',
      },
    ],
  };

  const promises = [];
  promises.push(self.registration.showNotification(notifTitle, options));

  // Set homescreen app icon badge if pendingCount exists
  if (data && data.pendingCount) {
    const count = parseInt(data.pendingCount, 10);
    if (!isNaN(count)) {
      const nav = self.navigator || navigator;
      if (nav && 'setAppBadge' in nav) {
        if (count > 0) {
          promises.push(nav.setAppBadge(count));
        } else {
          promises.push(nav.clearAppBadge());
        }
      }
    }
  }

  event.waitUntil(Promise.all(promises));
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const orderId = event.notification.data?.orderId;
  const data = event.notification.data || {};

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

      // Check if app is already open
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({
            type: 'FCM_NOTIFICATION_CLICK',
            orderId,
            data,
          });
          return client.focus();
        }
      }

      // App not open, open it
      if (self.clients.openWindow) {
        const url = orderId ? `/?orderId=${orderId}` : '/';
        return self.clients.openWindow(url);
      }
    })(),
  );
});

/**
 * Handle notification close
 */
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});

// PWA fetch handler for caching and offline routing fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(async () => {
      if (event.request.mode === 'navigate') {
        const cache = await caches.open('harinos-offline-cache');
        const cachedResponse = await cache.match('/index.html');
        if (cachedResponse) return cachedResponse;
      }
      return caches.match(event.request).then((response) => response || Response.error());
    })
  );
});
