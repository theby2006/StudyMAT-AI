# StudyMate Backend

Express + Prisma + Postgres (Neon) + OpenAI.

## Setup
```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

## Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | nodemon, hot reload |
| `npm start` | production entry |
| `npm run seed` | seed test user + sample data |
| `npm run prisma:migrate` | create migration |
| `npm run prisma:generate` | regenerate client |

## Folder structure
```
src/
  server.js           entry point
  app.js              express config + middleware
  config/             database + openai clients
  routes/             route definitions
  controllers/        request handlers
  services/           business logic + db access
  middleware/         auth, validation, rate limit, errors
  validators/         Zod schemas
  utils/              response + async wrappers
prisma/
  schema.prisma
  seed.js
```

## API routes
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | /api/auth/register | – | create user, return JWT |
| POST | /api/auth/login | – | login, return JWT |
| GET  | /api/auth/me | ✓ | current user |
| GET  | /api/notes | ✓ | list notes |
| POST | /api/notes | ✓ | create note |
| GET  | /api/notes/:id | ✓ | get note |
| PUT  | /api/notes/:id | ✓ | update note |
| DELETE | /api/notes/:id | ✓ | delete note (cascades flashcards) |
| POST | /api/ai/summarize/:noteId | ✓ + RL | summarize note |
| POST | /api/ai/flashcards/:noteId | ✓ + RL | generate flashcards |
| POST | /api/ai/quiz/:noteId | ✓ + RL | generate quiz |
| POST | /api/progress | ✓ | save quiz attempt |
| GET  | /api/progress | ✓ | list user attempts |

RL = rate limited (5 req / 15 min / IP).

## Response shape
```json
{ "success": true, "data": {...}, "message": "..." }
{ "success": false, "error": "...", "details": [...] }
```

## Deploy (Render)
1. New Web Service → connect GitHub repo.
2. Root directory: `backend`.
3. Build: `npm install && npx prisma generate && npx prisma migrate deploy`.
4. Start: `node src/server.js`.
5. Env vars: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `NODE_ENV=production`, `FRONTEND_URL`.
