importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

let messagingPromise = null;
const getMessaging = async () => {
  if (messagingPromise) return messagingPromise;

  messagingPromise = (async () => {
    try {
      const res = await fetch('/api/config');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const config = await res.json();
      
      if (!config.apiKey || !config.projectId) {
        throw new Error('Config returned empty values');
      }

      if (!self.firebase.apps.length) {
        self.firebase.initializeApp(config);
      }

      const messaging = self.firebase.messaging();
      messaging.onBackgroundMessage((payload) => {
        console.log('[SW] Background message received:', payload);
        const { title, body } = payload.notification || {};
        const data = payload.data || {};
        const notifTitle = title || data.title || "Harino's Pizza";
        const notifBody = body || data.body || 'You have an update from Harino\'s';
        
        const notificationOptions = {
          body: notifBody,
          icon: data.icon || '/icon-192.png',
          badge: data.badge || '/icon-192.png',
          tag: data.tag || `harinos-${Date.now()}`,
          data: data,
          vibrate: [400, 200, 400, 200, 400],
          requireInteraction: true,
          renotify: true,
        };
        self.registration.showNotification(notifTitle, notificationOptions);
      });
      return messaging;
    } catch (e) {
      console.warn('[SW] Dynamic initialize failed, falling back:', e);
      return null;
    }
  })();

  return messagingPromise;
};

// Listen to push events
self.addEventListener('push', (event) => {
  if (!event.data) return;
  event.waitUntil((async () => {
    const messaging = await getMessaging();
    if (!messaging) {
      // Fallback custom display if messaging couldn't initialize
      try {
        const payload = event.data.json();
        const { title, body } = payload.notification || {};
        const data = payload.data || {};
        const notifTitle = title || data.title || "Harino's Pizza";
        const notifBody = body || data.body || 'You have an update from Harino\'s';

        await self.registration.showNotification(notifTitle, {
          body: notifBody,
          icon: data.icon || '/icon-192.png',
          badge: data.badge || '/icon-192.png',
          tag: data.tag || `harinos-${Date.now()}`,
          data: data,
          vibrate: [400, 200, 400, 200, 400],
          requireInteraction: true,
          renotify: true,
        });
      } catch (err) {
        console.error('[SW] Fallback push parser error:', err);
      }
    }
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const orderId = event.notification.data?.orderId;
  const url = orderId ? `/?orderId=${orderId}` : '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        const parsedUrl = new URL(client.url, self.location.href);
        if (parsedUrl.pathname === '/' && 'focus' in client) {
          if (orderId) {
            client.postMessage({
              type: 'FCM_NOTIFICATION_CLICK',
              orderId,
              data: event.notification.data
            });
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
