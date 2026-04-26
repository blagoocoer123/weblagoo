import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.STORAGE_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.STORAGE_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'GET') {
    try {
      const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
      const visitorKey = `visitor:${ip}`;
      const now = Date.now();
      
      // Check last visit time
      const lastVisit = await redis.get(visitorKey);
      
      // Only count if last visit was more than 5 minutes ago
      if (!lastVisit || now - lastVisit > 300000) {
        await redis.incr('viewCount');
        await redis.set(visitorKey, now, { ex: 300 }); // Expire in 5 minutes
      }
      
      const views = await redis.get('viewCount') || 2;
      res.status(200).json({ views });
    } catch (error) {
      console.error('Redis error:', error);
      res.status(200).json({ views: '???' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
