import { Redis } from '@upstash/redis';

let redis;
try {
  redis = new Redis({
    url: process.env.STORAGE_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL?.replace('redis://', 'https://'),
    token: process.env.STORAGE_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || 'default',
  });
} catch (error) {
  console.error('Redis initialization error:', error);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'GET') {
    // If Redis is not configured, return default value
    if (!redis) {
      console.log('Redis not configured, returning default');
      return res.status(200).json({ views: 2 });
    }
    
    try {
      const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || 'unknown';
      const visitorKey = `visitor:${ip}`;
      const now = Date.now();
      
      console.log('Visitor IP:', ip);
      
      // Initialize viewCount if it doesn't exist
      const currentViews = await redis.get('viewCount');
      if (currentViews === null) {
        await redis.set('viewCount', 2);
        console.log('Initialized viewCount to 2');
      }
      
      // Check last visit time
      const lastVisit = await redis.get(visitorKey);
      console.log('Last visit:', lastVisit, 'Now:', now);
      
      // Only count if last visit was more than 24 hours ago (86400000ms = 24 hours)
      if (!lastVisit || now - parseInt(lastVisit) > 86400000) {
        const newCount = await redis.incr('viewCount');
        await redis.set(visitorKey, now.toString(), { ex: 86400 }); // Expire in 24 hours
        console.log('View counted! New count:', newCount);
      } else {
        console.log('Cooldown active, not counting');
      }
      
      const views = await redis.get('viewCount') || 2;
      console.log('Returning views:', views);
      res.status(200).json({ views: Number(views) });
    } catch (error) {
      console.error('Redis error:', error);
      res.status(200).json({ views: 2 });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
