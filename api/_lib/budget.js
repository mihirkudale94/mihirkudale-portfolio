/**
 * Daily LLM call budget.
 *
 * A public endpoint that spends money per request needs a ceiling. Once the
 * day's budget is used the agent stops being called and the client falls back
 * to rule-based replies, so the site degrades instead of running up a bill.
 *
 * Requires Upstash to enforce; without it the call is always allowed, since
 * an in-memory counter would reset on every cold start.
 *
 * Environment Variables (optional):
 * - MAX_DAILY_LLM_CALLS: defaults to 500
 */

import { logger } from './logger.js';
import { getRedis } from './redis.js';

const DEFAULT_LIMIT = 500;
const TTL_SECONDS = 60 * 60 * 48;

function limit() {
    const parsed = Number.parseInt(process.env.MAX_DAILY_LLM_CALLS ?? '', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_LIMIT;
}

function todayKey() {
    return `chat:budget:${new Date().toISOString().slice(0, 10)}`;
}

/**
 * Count one agent call against today's budget.
 * @returns {Promise<{allowed: boolean, used: number, limit: number}>}
 */
export async function consumeLlmCall() {
    const max = limit();
    const redis = await getRedis();
    if (!redis) return { allowed: true, used: 0, limit: max };

    try {
        const key = todayKey();
        const used = await redis.incr(key);
        if (used === 1) await redis.expire(key, TTL_SECONDS);

        const allowed = used <= max;
        if (!allowed) {
            logger.warn(`[Budget] Daily LLM budget exhausted (${used}/${max}) — serving fallback`);
        }
        return { allowed, used, limit: max };
    } catch (err) {
        // Fail open: a Redis outage should not take the chatbot down.
        logger.warn(`[Budget] Check failed, allowing request: ${err.message}`);
        return { allowed: true, used: 0, limit: max };
    }
}
