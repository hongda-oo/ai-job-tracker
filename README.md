# AI Job Application Tracker

A full-stack web app for tracking job applications, analyzing job descriptions with AI, and visualizing application progress.

## Description

Job seekers often track applications across spreadsheets, notes, and browser tabs. This app centralizes that workflow: log applications, move them through statuses (Applied → Interview → Offer, etc.), paste in a job description to get an AI-generated skill match against your profile, and see it all summarized on an analytics dashboard.

## Live Demo

_Coming soon._

## Tech Stack

- **Frontend:** React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS, Recharts
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Prisma ORM)
- **AI:** Provider-abstracted LLM integration (Anthropic / OpenAI)
- **Deployment:** Vercel (frontend), Render/Railway (backend), Neon/Railway/Supabase (database)

## Features

- Email/password authentication with JWT access + refresh tokens
- Full CRUD for job applications, with company and status tracking
- Status history timeline for every application
- Search, filter, sort, and paginate applications
- AI-powered job description analysis: required/preferred skills, summary, match score
- Candidate skill profile with skill-to-job matching
- Analytics dashboard: application volume, interview/offer conversion, status distribution, top skills

## Architecture

```text
React Client (Vite)
      ↓  REST (JSON)
Express API (TypeScript)
      ↓
PostgreSQL (Prisma)
      ↓
AI Provider (Anthropic / OpenAI)
```

## Screenshots

_Added as the UI is built out._

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL running locally (or a connection string to a hosted instance)

### Setup

```bash
git clone https://github.com/hongda-oo/ai-job-tracker.git
cd ai-job-tracker
npm install
```

Copy environment files and fill them in:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Run database migrations:

```bash
cd server
npx prisma migrate dev
```

Start both apps (from the repo root, in two terminals):

```bash
npm run dev:server
npm run dev:client
```

- Backend: http://localhost:4000
- Frontend: http://localhost:5173

## Environment Variables

See `server/.env.example` and `client/.env.example`.

## API Overview

Base URL: `/api/v1`

- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`
- `GET/POST /applications`, `GET/PATCH/DELETE /applications/:id`, `PATCH /applications/:id/status`, `GET /applications/:id/status-history`
- `GET/POST /profile/skills`, `DELETE /profile/skills/:id`
- `POST /applications/:id/analyze`
- `GET /analytics/overview`, `GET /analytics/status-distribution`, `GET /analytics/timeline`, `GET /analytics/top-skills`
- `GET /health`

## Future Improvements

- Resume PDF upload and AI resume parsing
- Browser extension for saving jobs from job boards
- Email reminders and calendar integration
- Kanban-style drag-and-drop application board
- OAuth login
