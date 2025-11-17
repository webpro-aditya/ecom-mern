// file_path: d:\NodeJS\practicepro\backend\src\middlewares\cacheMiddleware.js
const { getCache, setCache, isRedisEnabled } = require("../config/redis");

function cacheGet(ttlSeconds = 300) {
  return async (req, res, next) => {
    if (req.method !== "GET") return next();
    const key = `cache:${req.originalUrl}`;
    if (isRedisEnabled()) {
      const hit = await getCache(key);
      if (hit) return res.json(hit);
      const originalJson = res.json.bind(res);
      res.json = async (body) => { try { await setCache(key, body, ttlSeconds); } catch {} return originalJson(body); };
    }
    next();
  };
}

module.exports = { cacheGet };