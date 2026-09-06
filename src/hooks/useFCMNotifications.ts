import { useEffect, useState, useRef } from 'react';
import {
  initializeFCM,
  sendTokenToServer,
  getOrCreateFCMToken,
  subscribeFCMMessages,
  unsubscribeFCMMessages,
} from '../services/fcmService';

interface UseFCMNotificationsOptions {
  userId?: string;
  role?: 'admin' | 'manager' | 'staff' | 'customer';
  outletId?: string;
  onMessage?: (payload: any) => void;
}

interface UseFCMNotificationsResult {
  fcmToken: string | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  permission: NotificationPermission | 'unsupported';
}

/**
 * React hook for Firebase Cloud Messaging integration
 * Handles FCM initialization, token management, and message subscription
 */
export const useFCMNotifications = ({
  userId,
  role = 'customer',
  outletId,
  onMessage,
}: UseFCMNotificationsOptions = {}): UseFCMNotificationsResult => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const initAttempted = useRef(false);

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttempted.current) {
      return;
    }
    initAttempted.current = true;

    const initFCM = async () => {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        setPermission('unsupported');
        setError('Notifications are not supported by this browser');
        return;
      }

      setIsInitializing(true);
      setError(null);

      try {
        // Check current permission status
        setPermission(Notification.permission);

        // Initialize FCM (get token)
        const token = await getOrCreateFCMToken();

        if (token) {
          setFcmToken(token);

          // Send token to server if role and userId provided
          if (role && userId) {
            const sent = await sendTokenToServer(token, role, userId, outletId);
            if (!sent) {
              console.warn('Failed to send FCM token to server');
            }
          }

          // Subscribe to incoming messages
          subscribeFCMMessages(onMessage);

          setIsInitialized(true);
        } else {
          // Token not obtained - likely permission denied
          if (Notification.permission === 'default') {
            setError('Please enable notifications to receive updates');
          } else if (Notification.permission === 'denied') {
            setError(
              'Notifications are blocked. Please enable them in your browser settings.',
            );
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to initialize notifications: ${errorMsg}`);
        console.error('FCM initialization error:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initFCM();

    // Cleanup
    return () => {
      unsubscribeFCMMessages();
    };
  }, [userId, role, outletId, onMessage]);

  return {
    fcmToken,
    isInitialized,
    isInitializing,
    error,
    permission,
  };
};
