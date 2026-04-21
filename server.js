import express from 'express';
import cors from 'cors';
import chatHandler from './api/chat.js';
import ttsHandler from './api/tts.js';

const app = express();
const port = 3001;

// Enable CORS for local Vite dev server
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Parse JSON bodies
app.use(express.json());

// Mock Vercel Request/Response objects for local dev
const createVercelReqRes = (req, res) => {
    // Add Vercel-specific methods to response
    const vercelRes = Object.assign(res, {
        json: (data) => res.status(200).json(data),
        send: (data) => res.status(200).send(data)
    });
    return { req, res: vercelRes };
};

// Route handlers
app.post('/api/chat', async (req, res) => {
    const { req: vReq, res: vRes } = createVercelReqRes(req, res);
    await chatHandler(vReq, vRes);
});

app.post('/api/tts', async (req, res) => {
    const { req: vReq, res: vRes } = createVercelReqRes(req, res);
    await ttsHandler(vReq, vRes);
});

app.listen(port, () => {
    console.log(`🚀 Local dev API server running on http://localhost:${port}`);
    console.log(`- Chat endpoint: POST /api/chat`);
    console.log(`- TTS endpoint: POST /api/tts`);
});
