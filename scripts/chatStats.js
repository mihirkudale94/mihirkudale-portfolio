/**
 * Print chatbot analytics collected by api/_lib/analytics.js.
 *
 * Usage: npm run chat:stats
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local.
 */

import { Redis } from '@upstash/redis';

const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  console.error('Missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.');
  console.error('Add them to .env.local, then re-run `npm run chat:stats`.');
  process.exit(1);
}

const redis = new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN });

const DAYS = 7;
const TOP_N = 15;
const RECENT_N = 15;

function lastNDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    return d.toISOString().slice(0, 10);
  });
}

function heading(title) {
  console.log(`\n${title}`);
  console.log('-'.repeat(title.length));
}

const top = await redis.zrange('chat:q:freq', 0, TOP_N - 1, { rev: true, withScores: true });
const recent = await redis.lrange('chat:q:recent', 0, RECENT_N - 1);
const days = lastNDays(DAYS);
const dayStats = await Promise.all(days.map((d) => redis.hgetall(`chat:stats:${d}`)));

heading(`Most asked questions (top ${TOP_N})`);
if (!top || top.length === 0) {
  console.log('No questions recorded yet.');
} else {
  // zrange withScores returns a flat [member, score, member, score, ...] array
  for (let i = 0; i < top.length; i += 2) {
    console.log(`${String(top[i + 1]).padStart(5)}x  ${top[i]}`);
  }
}

heading(`Last ${DAYS} days`);
let any = false;
days.forEach((day, i) => {
  const s = dayStats[i];
  if (!s || Object.keys(s).length === 0) return;
  any = true;
  const parts = Object.entries(s)
    .filter(([k]) => k !== 'total')
    .map(([k, v]) => `${k}=${v}`)
    .join('  ');
  console.log(`${day}  total=${s.total ?? 0}  ${parts}`);
});
if (!any) console.log('No activity recorded yet.');

heading(`Most recent questions (${RECENT_N})`);
if (!recent || recent.length === 0) {
  console.log('Nothing recorded yet.');
} else {
  for (const raw of recent) {
    const e = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const when = new Date(e.ts).toISOString().replace('T', ' ').slice(0, 16);
    console.log(`${when}  [${e.outcome}]  ${e.q}`);
  }
}

console.log();
