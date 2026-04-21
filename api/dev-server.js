/**
 * Local development server — mirrors the Vercel serverless runtime on port 3001.
 * Vite (port 5173) proxies /api/* here during `npm run dev`.
 *
 * NOT used in production; Vercel handles routing there via vercel.json.
 */
import express from 'express';
import chatHandler from './chat.js';
import ttsHandler from './tts.js';
import vitalsHandler from './vitals.js';

const app = express();
app.use(express.json());

/** Adapt Vercel handler(req, res) to Express middleware */
function vercelHandler(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error('[DevServer] Unhandled error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}

app.all('/api/chat',   vercelHandler(chatHandler));
app.all('/api/tts',    vercelHandler(ttsHandler));
app.all('/api/vitals', vercelHandler(vitalsHandler));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`[DevServer] API listening on http://localhost:${PORT}`);
});
