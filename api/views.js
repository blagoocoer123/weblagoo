import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'GET') {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
    const visitorKey = `visitor:${ip}`;
    const now = Date.now();
    
    // Check last visit time
    const lastVisit = await kv.get(visitorKey);
    
    // Only count if last visit was more than 5 minutes ago
    if (!lastVisit || now - lastVisit > 300000) {
      await kv.incr('viewCount');
      await kv.set(visitorKey, now, { ex: 300 }); // Expire in 5 minutes
    }
    
    const views = await kv.get('viewCount') || 2;
    res.status(200).json({ views });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
