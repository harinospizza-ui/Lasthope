import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { hashPassword, verifyToken } from '../cryptoUtils.js';

const getJWTSecret = (): string => {
  return process.env.JWT_SECRET || 'dev-harinos-pizza-secret-key-32-chars-minimum';
};

const parseServiceAccount = (): admin.ServiceAccount => {
  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (encoded) {
    return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8')) as admin.ServiceAccount;
  }
  if (raw) {
    return JSON.parse(raw) as admin.ServiceAccount;
  }
  throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_BASE64.');
};

const getFirestore = (): admin.firestore.Firestore => {
  if (!admin.apps.length) {
    const serviceAccount = parseServiceAccount();
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || 'harinos-12902',
    });
  }
  return admin.firestore();
};

const logSecurityEvent = async (action: string, username: string, details: string, ip?: string) => {
  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    action,
    username,
    details,
    ip: ip || 'unknown'
  };
  try {
    const db = getFirestore();
    await db.collection('security_logs').doc(logEntry.id).set(logEntry);
  } catch (err) {
    console.error('Failed to log security event:', err);
  }
};

const authenticateRequest = (req: VercelRequest): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  return verifyToken(token, getJWTSecret());
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    const db = getFirestore();
    const { username, newPassword } = req.body as { username?: string; newPassword?: string };
    if (!username || !newPassword) {
      res.status(400).json({ success: false, message: 'Missing username or new password.' });
      return;
    }

    const caller = authenticateRequest(req);
    if (!caller || (caller.role !== 'admin' && caller.username !== username)) {
      await logSecurityEvent('UNAUTHORIZED_PASSWORD_CHANGE_ATTEMPT', caller?.username || 'anonymous', `Target: ${username}`);
      res.status(403).json({ success: false, message: 'Forbidden. Authorization required.' });
      return;
    }

    const hashed = hashPassword(newPassword);
    const staffRef = db.collection('users');
    const docRef = staffRef.doc(username);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      res.status(404).json({ success: false, message: 'Staff user not found.' });
      return;
    }
    await docRef.set({ password: hashed }, { merge: true });
    await logSecurityEvent('PASSWORD_CHANGED', caller.username, `Target: ${username}`);
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error.',
    });
  }
}
