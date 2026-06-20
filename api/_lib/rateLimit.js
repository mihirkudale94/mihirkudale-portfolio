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

import { logger } from './logger.js';

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
            logger.info('[RateLimit] Using Upstash Redis');
        } catch (err) {
            logger.warn(`[RateLimit] Upstash Redis init failed, falling back to in-memory: ${err.message}`);
            redisClient = null;
        }
    }

    return redisClient;
}

// In-memory fallback (only effective within a single serverless instance)
const memoryMap = new Map();
const MAX_MEMORY_KEYS = 1000;

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
        logger.error(`[RateLimit] Redis error, falling back to in-memory: ${err.message}`);
        return memoryRateLimit(clientId);
    }
}

/**
 * Simple in-memory rate limit with memory-growth bounding (prevents serverless leaks).
 */
function memoryRateLimit(clientId) {
    const now = Date.now();

    // Bound memory size to prevent OOM
    if (memoryMap.size > MAX_MEMORY_KEYS) {
        for (const [key, val] of memoryMap.entries()) {
            if (now > val.resetTime) {
                memoryMap.delete(key);
            }
        }
        // Force prune oldest if still exceeding bounds
        if (memoryMap.size > MAX_MEMORY_KEYS) {
            const keysToPrune = Array.from(memoryMap.keys()).slice(0, Math.floor(MAX_MEMORY_KEYS / 2));
            for (const key of keysToPrune) {
                memoryMap.delete(key);
            }
        }
    }

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
