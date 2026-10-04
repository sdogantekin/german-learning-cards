# German Learning Cards

A flashcard web app for practicing German verbs, nouns, and adjectives from
the TELC B1 word lists in `data/`. See `requirements.md` for the full spec.

## Stack

Next.js (App Router) + TypeScript + Tailwind, Drizzle ORM against Neon
Postgres, deployed on Vercel.

## Local development

1. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL`,
   `APP_PASSWORD`, and `SESSION_SECRET`.
2. Install dependencies: `npm install`
3. Apply migrations: `npx drizzle-kit migrate`
4. Seed word data from the CSVs in `data/`: `npm run db:seed`
5. Start the dev server: `npm run dev`

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm run start` — production build and start
- `npm run lint` — ESLint
- `npm run db:generate` — generate a Drizzle migration from `src/lib/schema.ts`
- `npm run db:push` — push schema changes directly to the DB (dev only)
- `npm run db:seed` — seed/update word data from `data/*.csv`
