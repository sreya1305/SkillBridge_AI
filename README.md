# SkillBridge AI

Frontend foundation built with React, Vite, and Tailwind CSS.

## Commands

```bash
npm install
npm run dev           # start the frontend
npm run start-server  # start the backend proxy
npm run build
npm test
```

## Backend proxy

The backend proxy is implemented in `server.js` and forwards requests to the Gemini API using `GEMINI_API_KEY` from environment variables. It also loads local values from `.env`. It does not use a database — the proxy only relays requests safely from the frontend to the AI API.

Before running the backend, paste your key into `.env`:

```text
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```

Optional environment variables:

```bash
GEMINI_API_BASE_URL=https://generativelanguage.googleapis.com/v1beta/
FRONTEND_ORIGIN=http://localhost:5173
PORT=4000
```

If you want both frontend and backend running locally at the same time, keep `npm run dev` running in one terminal and `npm run start-server` in another.

The proxy endpoint is available at:

```text
http://localhost:4000/api/ai/proxy
```

Use relative Gemini paths like `models/gemini-2.0-flash:generateContent` in the proxy request body.

## Source structure

```text
src/
  assets/             Static app assets
  components/         Reusable UI and layout components
  constants/          Shared configuration and static values
  features/           Domain-specific feature modules
  hooks/              Reusable React hooks
  lib/                Generic utility functions
  pages/              Route-level page components
  routes/             Route definitions
  services/           API and external-service clients
```
