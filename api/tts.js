/**
 * Vercel Serverless Function: Text-to-Speech
 * Uses google-tts-api (no deprecated 'request' dependency).
 */
import googleTTS from 'google-tts-api';
import { isRateLimited } from './lib/rateLimit.js';
import { logger } from './lib/logger.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const clientId = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (await isRateLimited(clientId)) {
    res.status(429).json({ error: 'Rate limit exceeded' });
    return;
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Invalid text provided' });
      return;
    }

    const sanitizedText = text.trim().slice(0, 4000);

    // Split long text into segments — each Google TTS URL has a ~200 char limit
    const segments = googleTTS.getAllAudioUrls(sanitizedText, {
      lang: 'en',
      slow: false,
      splitPunct: ',.!?',
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');

    // Fetch each segment and stream concatenated MP3 to response
    for (const { url } of segments) {
      const audioRes = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PortfolioTTS/1.0)' },
        signal: AbortSignal.timeout(10000),
      });
      if (!audioRes.ok) throw new Error(`TTS segment fetch failed: ${audioRes.status}`);
      const buffer = await audioRes.arrayBuffer();
      res.write(Buffer.from(buffer));
    }

    res.end();
  } catch (error) {
    logger.error('TTS handler error', { error: error.message });
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    } else {
      res.end();
    }
  }
}
