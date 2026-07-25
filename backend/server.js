import express from 'express';
import cors from 'cors';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filePath = '.env') {
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

loadEnvFile(resolve(__dirname, '.env'));

const AI_API_KEY = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
const AI_API_BASE_URL = process.env.GEMINI_API_BASE_URL || process.env.AI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const PORT = process.env.PORT || 4000;

if (!AI_API_KEY) {
  console.error('Missing GEMINI_API_KEY environment variable.');
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
        'x-goog-api-key': AI_API_KEY,
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
