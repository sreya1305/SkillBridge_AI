# SkillBridge AI

Frontend foundation built with React, Vite, and Tailwind CSS.

## Commands

```bash
npm install
npm run dev           # start the frontend
npm run start-server  # start the backend proxy
npm run build
```

## Backend proxy

The backend proxy is implemented in `server.js` and forwards requests to the AI provider using `AI_API_KEY` from environment variables.

Example environment variables:

```bash
AI_API_KEY=your_api_key_here
AI_API_BASE_URL=https://api.openai.com/v1/
FRONTEND_ORIGIN=http://localhost:5173
PORT=4000
```

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
