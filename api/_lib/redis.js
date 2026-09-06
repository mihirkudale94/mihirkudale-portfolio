/**
 * Shared Upstash Redis client.
 *
 * Initialised once per serverless instance and reused by every module that
 * needs Redis (rate limiting, analytics). Returns null when Upstash is not
 * configured, so callers can degrade gracefully instead of throwing.
 *
 * Environment Variables (optional):
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

import { logger } from './logger.js';

let redisClient = null;
let redisInitialized = false;

export async function getRedis() {
    if (redisInitialized) return redisClient;

    redisInitialized = true;

    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        try {
            const { Redis } = await import('@upstash/redis');
            redisClient = new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL,
                token: process.env.UPSTASH_REDIS_REST_TOKEN,
            });
            logger.info('[Redis] Upstash client ready');
        } catch (err) {
            logger.warn(`[Redis] Upstash init failed: ${err.message}`);
            redisClient = null;
        }
    }

    return redisClient;
}
