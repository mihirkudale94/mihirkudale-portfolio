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

const RATE_LIMIT = { maxRequests: 30, windowMs: 60_000 };

/**
 * Lazily initialize Redis client (only when env vars are present).
 */
async function getRedis() {
    if (redisClient !== undefined && redisClient !== null) return redisClient;

    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        try {
            const { Redis } = await import('@upstash/redis');
            redisClient = new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL,
                token: process.env.UPSTASH_REDIS_REST_TOKEN,
            });
            console.log('[RateLimit] Using Upstash Redis');
            return redisClient;
        } catch (err) {
            console.warn('[RateLimit] Upstash Redis init failed, falling back to in-memory:', err.message);
            redisClient = null;
        }
    } else {
        redisClient = null;
    }
    return null;
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
        // Pipeline: remove old entries, add current, count, set expiry
        const pipe = redis.pipeline();
        pipe.zremrangebyscore(key, 0, windowStart);
        pipe.zadd(key, { score: now, member: `${now}-${Math.random()}` });
        pipe.zcard(key);
        pipe.expire(key, Math.ceil(RATE_LIMIT.windowMs / 1000));

        const results = await pipe.exec();
        const count = results[2]; // zcard result

        return count > RATE_LIMIT.maxRequests;
    } catch (err) {
        console.error('[RateLimit] Redis error, allowing request:', err.message);
        return false; // Fail open — don't block users on Redis errors
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
