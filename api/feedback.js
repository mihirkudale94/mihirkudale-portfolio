/**
 * Vercel Serverless Function: chat answer feedback.
 *
 * Records a thumbs up/down against an answer so the assistant's quality is
 * measurable rather than assumed. Down-votes also keep the question and the
 * answer that earned them, which is the raw material for improving the
 * system prompt or the portfolio data behind it.
 *
 * Requires Upstash to store anything; a no-op otherwise, and always returns
 * 200 so the widget never shows an error for a non-essential action.
 *
 * Keys:
 * - chat:feedback:<YYYY-MM-DD>  hash  up / down counters per day
 * - chat:feedback:negative      list  recent down-voted Q&A pairs (capped)
 */

import { getRedis } from './_lib/redis.js';
import { isRateLimited } from './_lib/rateLimit.js';
import { logger } from './_lib/logger.js';

const NEGATIVE_KEY = 'chat:feedback:negative';
const MAX_NEGATIVE = 100;
const MAX_STORED_TEXT = 400;
const TTL_SECONDS = 60 * 60 * 24 * 90;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const { rating, question, answer } = req.body ?? {};

    if (rating !== 'up' && rating !== 'down') {
      res.status(400).json({ error: 'Invalid rating' });
      return;
    }

    const clientId = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    if (await isRateLimited(clientId)) {
      res.status(429).json({ error: 'Rate limit exceeded' });
      return;
    }

    const redis = await getRedis();
    if (!redis) {
      // Nowhere to store it; the visitor does not need to know.
      res.status(200).json({ ok: true, stored: false });
      return;
    }

    const key = `chat:feedback:${new Date().toISOString().slice(0, 10)}`;
    const pipe = redis.pipeline();
    pipe.hincrby(key, rating, 1);
    pipe.expire(key, TTL_SECONDS);

    if (rating === 'down') {
      pipe.lpush(NEGATIVE_KEY, JSON.stringify({
        q: typeof question === 'string' ? question.slice(0, MAX_STORED_TEXT) : '',
        a: typeof answer === 'string' ? answer.slice(0, MAX_STORED_TEXT) : '',
        ts: Date.now(),
      }));
      pipe.ltrim(NEGATIVE_KEY, 0, MAX_NEGATIVE - 1);
    }

    await pipe.exec();
    res.status(200).json({ ok: true, stored: true });
  } catch (error) {
    logger.error('Feedback API error:', error.message);
    // Feedback is non-essential: never surface a failure to the visitor.
    res.status(200).json({ ok: true, stored: false });
  }
}
