import { verifyAccessToken } from '../utils/jwt.js';

export function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'missing auth' });
  try {
    const payload = verifyAccessToken(h.replace('Bearer ', ''));
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'invalid token' });
  }
}
