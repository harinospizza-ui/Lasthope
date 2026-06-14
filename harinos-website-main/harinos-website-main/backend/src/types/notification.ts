// Notification-related TypeScript types for backend

export type NotificationRole = 'admin' | 'manager' | 'staff' | 'customer';

export type NotificationEventType = 
  | 'NEW_ORDER' 
  | 'PREPARING' 
  | 'READY' 
  | 'OUT_FOR_DELIVERY' 
  | 'DONE' 
  | 'CANCELLED';

export interface DeviceToken {
  id?: string;
  userId: string; // Phone number or customer ID
  fcmToken: string;
  role: NotificationRole;
  outletId?: string;
  phoneNumber?: string;
  email?: string;
  deviceType: 'browser' | 'mobile' | 'app';
  deviceInfo: {
    userAgent: string;
    platform: 'Web' | 'iOS' | 'Android';
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  icon?: string;
  badge?: string;
  tag?: string;
}

export interface SendNotificationRequest {
  targetRole?: NotificationRole;
  userId?: string;
  outletId?: string;
  title: string;
  body: string;
  orderId?: string;
  data?: Record<string, string>;
}

export interface SendNotificationResponse {
  success: boolean;
  sent: number;
  failed: number;
  errors?: string[];
}

export interface NotificationLog {
  orderId: string;
  eventType: NotificationEventType;
  recipients: Array<{
    role: NotificationRole;
    fcmToken: string;
    status: 'sent' | 'failed' | 'queued';
    sentAt: string;
    error?: string;
  }>;
  message: NotificationPayload;
}

export interface FCMTokenRegisterRequest {
  fcmToken: string;
  role: NotificationRole;
  userId: string;
  outletId?: string;
  deviceInfo: {
    userAgent: string;
    platform: 'Web' | 'iOS' | 'Android';
  };
}
