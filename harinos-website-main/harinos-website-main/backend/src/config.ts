import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import admin from 'firebase-admin';

dotenv.config();
dotenv.config({ path: '.env.local' });

const configDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(configDir, '..');
dotenv.config({ path: path.join(backendRoot, '.env') });
dotenv.config({ path: path.join(backendRoot, '.env.local') });

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const parseServiceAccount = (): object | null => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    return JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')) as object;
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as object;
  }

  return null;
};

let firebaseAppInstance: admin.app.App | null = null;

export const config = {
  server: {
    port: toNumber(process.env.PORT, 4000),
  },
  storage: {
    driver: (process.env.STORAGE_DRIVER ?? 'json').toLowerCase(),
  },
  mysql: {
    host: process.env.MYSQL_HOST ?? '127.0.0.1',
    port: toNumber(process.env.MYSQL_PORT, 3306),
    user: process.env.MYSQL_USER ?? 'root',
    password: process.env.MYSQL_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE ?? 'harinos_orders',
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? '',
    serviceAccount: parseServiceAccount(),
  },
  fileStore: {
    rootPath: process.env.ORDER_FILE_STORE ?? './harinos-data',
  },
};

/**
 * Initialize and return Firebase Admin App
 * Used for Firestore, Cloud Messaging, and other Firebase services
 */
export const getFirebaseApp = (): admin.app.App => {
  if (firebaseAppInstance) {
    return firebaseAppInstance;
  }

  const serviceAccount = config.firebase.serviceAccount;
  if (!serviceAccount || !config.firebase.projectId) {
    throw new Error(
      'Firebase service account and project ID must be configured. ' +
      'Set FIREBASE_SERVICE_ACCOUNT_BASE64 and FIREBASE_PROJECT_ID environment variables.',
    );
  }

  firebaseAppInstance = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: config.firebase.projectId,
  });

  return firebaseAppInstance;
};
