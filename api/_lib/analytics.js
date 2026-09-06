/**
 * Conversation analytics.
 *
 * Answers the question the portfolio actually cares about: what do visitors
 * ask? Writes to Upstash Redis when configured and is a no-op otherwise, so
 * the chat endpoint behaves identically with or without it.
 *
 * Privacy: no IP address, no client identifier and no assistant replies are
 * stored — only the visitor's question text and coarse daily counters. Read
 * it back with `npm run chat:stats`.
 *
 * Keys:
 * - chat:q:recent   list  most recent questions (capped), newest first
 * - chat:q:freq     zset  normalised question -> number of times asked
 * - chat:stats:<YYYY-MM-DD>  hash  per-day outcome counters
 *
 * Environment Variables (optional):
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

import { logger } from './logger.js';
import { getRedis } from './redis.js';

const RECENT_KEY = 'chat:q:recent';
const FREQ_KEY = 'chat:q:freq';
const MAX_RECENT = 300;
const MAX_QUESTION_LENGTH = 200;
const STATS_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days

/** Collapse casing, punctuation and spacing so "Why hire him?" and "why hire him" count as one. */
export function normalizeQuestion(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, MAX_QUESTION_LENGTH);
}

function todayKey() {
    return `chat:stats:${new Date().toISOString().slice(0, 10)}`;
}

/**
 * Record one chat turn. Never throws and never rejects — analytics must not be
 * able to break a conversation.
 *
 * @param {object} event
 * @param {string} event.question - the visitor's message
 * @param {string} event.outcome  - 'api' | 'fallback' | 'blocked' | 'error' | 'rate_limited'
 */
export async function logChatEvent({ question, outcome }) {
    const redis = await getRedis();
    if (!redis || typeof question !== 'string' || !question.trim()) return;

    const normalized = normalizeQuestion(question);
    if (!normalized) return;

    try {
        const statsKey = todayKey();
        const pipe = redis.pipeline();

        pipe.lpush(RECENT_KEY, JSON.stringify({
            q: question.trim().slice(0, MAX_QUESTION_LENGTH),
            outcome,
            ts: Date.now(),
        }));
        pipe.ltrim(RECENT_KEY, 0, MAX_RECENT - 1);
        pipe.zincrby(FREQ_KEY, 1, normalized);
        pipe.hincrby(statsKey, 'total', 1);
        pipe.hincrby(statsKey, outcome, 1);
        pipe.expire(statsKey, STATS_TTL_SECONDS);

        await pipe.exec();
    } catch (err) {
        // Swallow: an analytics outage must never surface to the visitor.
        logger.warn(`[Analytics] Write failed: ${err.message}`);
    }
}
