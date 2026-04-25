let viewCount = 2;
const visitors = new Map(); // Store IP and last visit time

export default function handler(req, res) {
  if (req.method === 'GET') {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = Date.now();
    const lastVisit = visitors.get(ip) || 0;
    
    // Only count if last visit was more than 5 minutes ago
    if (now - lastVisit > 300000) { // 5 minutes = 300000ms
      viewCount++;
      visitors.set(ip, now);
    }
    
    res.status(200).json({ views: viewCount });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
