import type { VercelRequest, VercelResponse } from '@vercel/node';

export async function proxyToBackend(req: VercelRequest, res: VercelResponse, targetPath: string) {
  // Enforce CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const backendUrl = process.env.BACKEND_API_URL;
  if (!backendUrl) {
    // If BACKEND_API_URL is not set, return the clean failsafe message
    res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable. Please try again shortly.'
    });
    return;
  }

  // Construct final backend URL
  const cleanBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
  const cleanPath = targetPath.startsWith('/') ? targetPath : '/' + targetPath;
  const destUrl = `${cleanBase}${cleanPath}`;

  // Forward query string if present
  const queryStr = req.url?.split('?')[1];
  const finalUrl = queryStr ? `${destUrl}?${queryStr}` : destUrl;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    const options: RequestInit = {
      method: req.method,
      headers,
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
      options.body = JSON.stringify(req.body);
    }

    // Call separate Django API server
    const backendRes = await fetch(finalUrl, options);
    
    // Check response Content-Type
    const contentType = backendRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await backendRes.json();
      res.status(backendRes.status).json(data);
    } else {
      const text = await backendRes.text();
      res.status(backendRes.status).send(text);
    }
  } catch (error: any) {
    console.error('Gateway connection failure:', error);
    // Enforce Secure Failsafe: hide internal paths, stack traces, and database locations
    res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable. Please try again shortly.'
    });
  }
}
