/**
 * Answer cache for first-turn questions.
 *
 * A portfolio assistant is asked the same handful of questions over and over.
 * Each one otherwise costs a full multi-call agent loop, so repeats are served
 * from Redis instead — cheaper, and near-instant for the visitor.
 *
 * Only first-turn questions are cached: once a thread has context, the same
 * words can warrant a different answer. Cache keys reuse the analytics
 * normalisation deliberately, so "most asked" and "most cached" are the same
 * set of questions.
 *
 * A no-op when Upstash is unset. Never throws.
 */

import { logger } from './logger.js';
import { getRedis } from './redis.js';
import { normalizeQuestion } from './analytics.js';

const PREFIX = 'chat:cache:';
const TTL_SECONDS = 60 * 60 * 24; // 24h — long enough to help, short enough that edits land

function keyFor(question) {
    const normalized = normalizeQuestion(question);
    return normalized ? `${PREFIX}${normalized}` : null;
}

/**
 * @returns {Promise<{reply: string, messages: Array, action: object|null}|null>}
 */
export async function getCachedAnswer(question) {
    const redis = await getRedis();
    const key = redis && keyFor(question);
    if (!key) return null;

    try {
        const hit = await redis.get(key);
        if (!hit) return null;
        return typeof hit === 'string' ? JSON.parse(hit) : hit;
    } catch (err) {
        logger.warn(`[Cache] Read failed: ${err.message}`);
        return null;
    }
}

export async function setCachedAnswer(question, payload) {
    const redis = await getRedis();
    const key = redis && keyFor(question);
    if (!key || !payload?.reply) return;

    try {
        await redis.set(key, JSON.stringify(payload), { ex: TTL_SECONDS });
    } catch (err) {
        logger.warn(`[Cache] Write failed: ${err.message}`);
    }
}
