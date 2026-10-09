# Quiz Builder

A full-stack app for building quizzes with **True/False**, **Short answer** and **Multiple choice** questions. Create a quiz, browse all quizzes, open any one to see its structure, and delete the ones you don't need.

- **Backend:** NestJS · TypeScript · PostgreSQL · Prisma
- **Frontend:** Next.js 16 (App Router) · React 19 · TypeScript · React Hook Form · Zod · Tailwind CSS

## Prerequisites

- **Node.js 20.19+** (developed on Node 24) and npm
- **Docker** to run PostgreSQL. You can use your own PostgreSQL instead; see [Database setup](#database-setup).

## Quick start

From the repository root:

```bash
# 1. Start PostgreSQL (port 5432)
docker compose up -d

# 2. Backend: http://localhost:3001
cd backend
cp .env.example .env
npm install
npm run db:deploy      # apply database migrations
npm run db:seed        # optional: add 3 sample quizzes
npm run start:dev

# 3. Frontend: http://localhost:3000 (in a second terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

## Database setup

`docker-compose.yml` starts PostgreSQL 17 with the credentials from `backend/.env.example`, so the defaults work as they are:

```bash
docker compose up -d      # start
docker compose down       # stop (data is kept in a Docker volume)
docker compose down -v    # stop and delete all data
```

**Using your own PostgreSQL:** create a database and set `DATABASE_URL` in `backend/.env`.

Then, in `backend/`:

| Command | What it does |
| --- | --- |
| `npm run db:deploy` | Apply all migrations to the database |
| `npm run db:migrate` | Create and apply a new migration after changing `prisma/schema.prisma` |
| `npm run db:seed` | Add sample quizzes. Safe to run again: existing quizzes are skipped |
| `npm run db:studio` | Open Prisma Studio to browse the data |

## Environment variables

Both apps read their settings from env files. Only the `*.env.example` templates are committed.

**`backend/.env`**

| Variable | Default | Description |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://quiz:quiz@localhost:5432/quiz_builder?schema=public` | PostgreSQL connection string |
| `PORT` | `3001` | API port |
| `CORS_ORIGIN` | `http://localhost:3000` | Frontend origin allowed to call the API |

**`frontend/.env.local`**

| Variable | Default | Description |
| --- | --- | --- |
| `API_URL` | `http://localhost:3001` | Backend base URL. Used on the server only, by Server Components and Server Actions |

## Creating a sample quiz

Pick one of these:

1. **Seed script.** `npm run db:seed` in `backend/` creates *JavaScript Basics*, *World Geography* and *TypeScript Fundamentals*.
2. **UI.** Open http://localhost:3000/create, enter a title, add questions, choose the correct answers and click **Create quiz**.
3. **API.**

   ```bash
   curl -X POST http://localhost:3001/quizzes \
     -H 'Content-Type: application/json' \
     -d '{
       "title": "Sample quiz",
       "questions": [
         { "type": "BOOLEAN", "text": "The sky is blue.", "booleanAnswer": true },
         { "type": "INPUT", "text": "Capital of France?", "inputAnswer": "Paris" },
         {
           "type": "CHECKBOX",
           "text": "Pick the even numbers",
           "options": [
             { "text": "1", "isCorrect": false },
             { "text": "2", "isCorrect": true },
             { "text": "4", "isCorrect": true }
           ]
         }
       ]
     }'
   ```

## API

| Method | Endpoint | Description | Success |
| --- | --- | --- | --- |
| `POST` | `/quizzes` | Create a quiz (body as in the example above) | `201` with the created quiz |
| `GET` | `/quizzes` | List quizzes: `id`, `title`, `createdAt`, `questionCount` | `200` |
| `GET` | `/quizzes/:id` | Quiz with all questions and options | `200` |
| `DELETE` | `/quizzes/:id` | Delete a quiz together with its questions | `204` |

Errors:
- `400` when validation fails. The body lists every problem, e.g. `questions.0.options must contain at least one correct option`.
- `400` for a non-numeric id.
- `404` for a quiz that does not exist.

Validation rules:
- The title is required.
- A quiz needs at least one question.
- A **BOOLEAN** question needs `booleanAnswer`.
- An **INPUT** question needs `inputAnswer`.
- A **CHECKBOX** question needs 2–10 options, with at least one marked correct.

The frontend applies the same rules before sending the form.

## Project structure

```
quiz-builder/
├── docker-compose.yml          # PostgreSQL for local development
├── backend/                    # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma       # Quiz → Question → Option (cascade delete)
│   │   ├── migrations/
│   │   └── seed.ts             # sample quizzes
│   ├── src/
│   │   ├── main.ts             # CORS, global ValidationPipe
│   │   ├── prisma/             # PrismaService (global module)
│   │   └── quizzes/            # controller, service, DTOs with validation
│   └── test/                   # e2e tests (run against the database)
└── frontend/                   # Next.js app
    ├── app/                    # routes (App Router)
    │   ├── page.tsx            #   /             home
    │   ├── create/             #   /create       quiz creation form
    │   └── quizzes/            #   /quizzes      list, /quizzes/[id] details
    ├── components/             # UI: quiz form, quiz list, question view…
    ├── services/               # API client and Server Actions
    ├── lib/                    # shared helpers
    └── types/                  # API types
```

> **Note on `pages/`:** the suggested structure lists `frontend/pages/`. This project uses the **App Router** (`app/`), which is the current recommended way to build Next.js apps. Routes live in `frontend/app/` and match the required paths: `/create`, `/quizzes`, `/quizzes/:id`.

## Code quality

Both apps use **ESLint** and **Prettier**:

```bash
npm run lint           # ESLint
npm run format         # format all files with Prettier
npm run format:check   # check formatting only
```

Backend e2e tests (they need the database running):

```bash
cd backend && npm run test:e2e
```

## Implementation notes

- **Data model.** Each question stores the correct answer for its type: `booleanAnswer`, `inputAnswer`, or `options` with an `isCorrect` flag. The answer fields always match the question type.
- **Data flow.**
  - Pages fetch data in Server Components and stream it in with `<Suspense>` skeletons.
  - Create and delete run through Server Actions that call the API and refresh the affected pages.
  - Deleting is optimistic: the card disappears right away and comes back if the request fails.
- **Read-only details page.** Questions are shown with their structure and correct answers highlighted. Solving quizzes is out of scope.
- **Responsive design.** Layouts adapt from phones to desktops. The navigation stays at the top on every screen size, so it never collides with the address bar that mobile browsers show at the bottom.
