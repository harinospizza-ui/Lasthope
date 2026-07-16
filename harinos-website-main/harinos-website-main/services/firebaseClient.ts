import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY.trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'harinos-76252214-d8e69.firebaseapp.com').trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'harinos-76252214-d8e69').trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'harinos-76252214-d8e69.firebasestorage.app').trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '243467217728').trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID ?? '1:243467217728:web:6478e1c49af407e294e8a5').trim(),
};

let dynamicFirebaseConfig: any = null;

export const setDynamicFirebaseConfig = (config: any) => {
  dynamicFirebaseConfig = config;
};

export const FIRESTORE_ORDERS_COLLECTION = 'orders';
export const FIRESTORE_CUSTOMERS_COLLECTION = 'customers';
export const FIRESTORE_NOTIFICATION_TOKENS_COLLECTION = 'notification_tokens';
export const FIRESTORE_MENU_ITEMS_COLLECTION = 'menu_items';
export const FIRESTORE_OUTLETS_COLLECTION = 'outlets';
export const FIRESTORE_OFFERS_COLLECTION = 'offers';
export const FIRESTORE_STAFF_USERS_COLLECTION = 'users';
export const FIRESTORE_WALLET_TRANSACTIONS_COLLECTION = 'wallet_transactions';
export const FIRESTORE_VERIFICATION_REQUESTS_COLLECTION = 'customerVerificationRequests';


export const isFirebaseClientConfigured = (): boolean => {
  const cfg = dynamicFirebaseConfig || firebaseConfig;
  return Boolean(cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId);
};

export const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length) {
    return getApps()[0];
  }

  const cfg = dynamicFirebaseConfig || firebaseConfig;
  if (!cfg.apiKey || !cfg.authDomain || !cfg.projectId || !cfg.appId) {
    throw new Error('Firebase client is not configured.');
  }

  return initializeApp(cfg);
};

export const db = () => getFirestore(getFirebaseApp());
export const auth = () => getAuth(getFirebaseApp());
export const storage = () => getStorage(getFirebaseApp());
