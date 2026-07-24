import express from 'express';
import cors from 'cors';

const AI_API_KEY = process.env.AI_API_KEY;
const AI_API_BASE_URL = process.env.AI_API_BASE_URL || 'https://api.openai.com/v1/';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const PORT = process.env.PORT || 4000;

if (!AI_API_KEY) {
  console.error('Missing AI_API_KEY environment variable.');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', proxy: true });
});

app.post('/api/ai/proxy', async (req, res) => {
  const { path, method = 'POST', body } = req.body;

  if (!path || typeof path !== 'string') {
    return res.status(400).json({ error: 'Request body must include a string `path`.' });
  }

  if (/^https?:\/\//i.test(path)) {
    return res.status(400).json({ error: 'Absolute URLs are not allowed. Use a relative path instead.' });
  }

  const targetUrl = new URL(path, AI_API_BASE_URL).toString();

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseBody = await response.text();
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      return res.status(response.status).json(JSON.parse(responseBody));
    }

    res.status(response.status).send(responseBody);
  } catch (error) {
    console.error('AI proxy request failed:', error);
    res.status(502).json({ error: 'AI proxy request failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`AI proxy server listening on http://localhost:${PORT}`);
});
