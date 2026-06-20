import type { VercelRequest, VercelResponse } from '@vercel/node';
import { proxyToBackend } from './proxy.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const urlPath = req.url?.split('?')[0] || '/api/customers';
  return proxyToBackend(req, res, urlPath);
}
