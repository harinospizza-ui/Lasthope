import type { VercelRequest, VercelResponse } from '@vercel/node';
import { proxyToBackend } from './proxy.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return proxyToBackend(req, res, '/api/settings');
}
