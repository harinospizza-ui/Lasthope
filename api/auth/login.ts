import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { verifyPassword, hashPassword, generateToken } from '../cryptoUtils.js';

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

const DEFAULT_STAFF = [
  { role: 'admin', username: 'Admin_Harinos', password: 'Harinos_Admin', outletId: null },
  { role: 'manager', username: 'Manager_Harinos', password: 'Harinos_Manager', outletId: null },
  { role: 'staff', username: 'Staff_Harinos', password: 'Harinos_Staff', outletId: null },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
    const { username, password } = req.body as { username?: string; password?: string };
    if (!username || !password) {
      res.status(400).json({ success: false, message: 'Missing username or password.' });
      return;
    }

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';

    const staffRef = db.collection('users');
    const snapshot = await staffRef.get();
    
    if (snapshot.empty) {
      for (const user of DEFAULT_STAFF) {
        const hashedUser = { ...user, password: hashPassword(user.password) };
        await staffRef.doc(user.username).set(hashedUser);
      }
    }
    
    const userDoc = await staffRef.doc(username).get();
    if (!userDoc.exists) {
      await logSecurityEvent('FAILED_LOGIN', username, 'Non-existent user attempt', clientIp);
      res.status(401).json({ success: false, message: 'Invalid username or password.' });
      return;
    }
    
    const user = userDoc.data() as any;
    if (!verifyPassword(password, user.password)) {
      await logSecurityEvent('FAILED_LOGIN', username, 'Invalid password attempt', clientIp);
      res.status(401).json({ success: false, message: 'Invalid username or password.' });
      return;
    }

    // Auto hash password if stored as plaintext
    if (!user.password.startsWith('pbkdf2$')) {
      const hashed = hashPassword(password);
      await staffRef.doc(username).update({ password: hashed });
      user.password = hashed;
      await logSecurityEvent('PASSWORD_UPGRADED_TO_HASH', username, 'Migrated plaintext password to pbkdf2 hash', clientIp);
    }

    const token = generateToken({ username: user.username, role: user.role, outletId: user.outletId }, getJWTSecret());
    await logSecurityEvent('SUCCESSFUL_LOGIN', username, `Role: ${user.role}`, clientIp);
    
    res.json({
      success: true,
      token,
      user: { role: user.role, username: user.username, outletId: user.outletId },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error.',
    });
  }
}
