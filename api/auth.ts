import type { VercelRequest, VercelResponse } from '@vercel/node';
import { proxyToBackend } from './proxy.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Extract route path (e.g. /api/auth/login or /api/auth/change-password)
  const urlPath = req.url?.split('?')[0] || '/api/auth/login';
  return proxyToBackend(req, res, urlPath);
}
