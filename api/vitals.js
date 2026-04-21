/**
 * Vercel Serverless Function: Core Web Vitals collector.
 * Receives beacon from the frontend and logs structured metrics
 * visible in Vercel production logs.
 */
import { logger } from './lib/logger.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }

  try {
    const { name, value, rating, id } = req.body || {};
    if (name) {
      logger.info('web-vital', { name, value: Math.round(value ?? 0), rating, id });
    }
  } catch { /* ignore malformed payloads */ }

  // 204 No Content — beacon doesn't need a response body
  res.status(204).end();
}
