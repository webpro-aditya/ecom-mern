// file_path: d:\NodeJS\practicepro\backend\src\config\redis.js
const url = process.env.REDIS_URL || "redis://localhost:6379";

let client = null;
let connected = false;
let enabled = true;

try {
  const { createClient } = require("redis");
  client = createClient({ url });
  client.on("error", (err) => { connected = false; console.error("Redis error:", err.message); });
  (async () => {
    try {
      if (!client.isOpen) await client.connect();
      connected = true;
      console.log("Redis connected:", url);
    } catch (e) {
      enabled = false;
      connected = false;
      console.warn("Redis connection failed:", e.message);
    }
  })();
} catch (e) {
  enabled = false;
  connected = false;
  console.warn("Redis client not installed, caching disabled.");
  client = {
    isOpen: false,
    get: async () => null,
    set: async () => {},
    del: async () => {},
    scanIterator: async function* () {},
    ping: async () => null,
    connect: async () => {},
  };
}

async function getCache(key) {
  try { const v = await client.get(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
async function setCache(key, value, ttlSeconds) {
  try { await client.set(key, JSON.stringify(value), { EX: ttlSeconds }); } catch {}
}
async function delCache(key) { try { await client.del(key); } catch {} }
async function delByPattern(pattern) {
  try { for await (const k of client.scanIterator({ MATCH: pattern, COUNT: 200 })) await client.del(k); } catch {}
}
async function ping() { try { return await client.ping(); } catch { return null; } }
function isRedisEnabled() { return enabled && connected && client && client.isOpen; }

module.exports = { client, getCache, setCache, delCache, delByPattern, ping, isRedisEnabled };