/**
 * Production-grade Rate Limiter
 *
 * Uses Upstash Redis (sliding window) when configured,
 * falls back to in-memory Map for local dev.
 *
 * Environment Variables (optional):
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

let redisClient = null;
let redisInitialized = false;

const RATE_LIMIT = { maxRequests: 30, windowMs: 60_000 };

async function getRedis() {
    if (redisInitialized) return redisClient;

    redisInitialized = true;

    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        try {
            const { Redis } = await import('@upstash/redis');
            redisClient = new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL,
                token: process.env.UPSTASH_REDIS_REST_TOKEN,
            });
            console.log('[RateLimit] Using Upstash Redis');
        } catch (err) {
            console.warn('[RateLimit] Upstash Redis init failed, falling back to in-memory:', err.message);
            redisClient = null;
        }
    }

    return redisClient;
}

// In-memory fallback (only effective within a single serverless instance)
const memoryMap = new Map();

/**
 * Check if a client has exceeded the rate limit.
 * @param {string} clientId - IP or unique identifier
 * @returns {Promise<boolean>} true if rate limited
 */
export async function isRateLimited(clientId) {
    const redis = await getRedis();

    if (redis) {
        return redisRateLimit(redis, clientId);
    }
    return memoryRateLimit(clientId);
}

/**
 * Sliding window rate limit using Redis ZSET.
 */
async function redisRateLimit(redis, clientId) {
    const key = `rl:${clientId}`;
    const now = Date.now();
    const windowStart = now - RATE_LIMIT.windowMs;

    try {
        const pipe = redis.pipeline();
        pipe.zremrangebyscore(key, 0, windowStart);
        pipe.zadd(key, { score: now, member: `${now}-${Math.random()}` });
        pipe.zcard(key);
        pipe.expire(key, Math.ceil(RATE_LIMIT.windowMs / 1000));

        const results = await pipe.exec();
        const count = results[2];

        return count > RATE_LIMIT.maxRequests;
    } catch (err) {
        console.error('[RateLimit] Redis error, allowing request:', err.message);
        return false;
    }
}

/**
 * Simple in-memory rate limit (per-instance only).
 */
function memoryRateLimit(clientId) {
    const now = Date.now();
    const data = memoryMap.get(clientId) || { count: 0, resetTime: now + RATE_LIMIT.windowMs };

    if (now > data.resetTime) {
        data.count = 1;
        data.resetTime = now + RATE_LIMIT.windowMs;
    } else {
        data.count++;
    }

    memoryMap.set(clientId, data);
    return data.count > RATE_LIMIT.maxRequests;
}
