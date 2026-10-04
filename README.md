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

## Updating word data

The CSVs in `data/` are the source of truth for word content. After editing
one:

1. Re-seed the database (this updates existing words by their unique key —
   infinitiv/noun/adjective — so it's safe to re-run):
   ```bash
   npm run db:seed
   ```
   `DATABASE_URL` in `.env.local` points at the same Neon database the
   deployed app uses, so this one command updates data for both local dev
   and production — there's no separate "seed production" step.
2. Commit and push the CSV change:
   ```bash
   git add data/
   git commit -m "Update word data"
   git push
   ```
3. Deploy the app itself only if you also changed code (the CSV data lives
   in the database, not in the deployed build, so a data-only change
   doesn't require a redeploy). If you do need to deploy:
   - If the GitHub repo is connected to the Vercel project (Settings → Git
     in the Vercel dashboard), pushing to `main` auto-deploys.
   - Otherwise, deploy manually: `npx vercel --prod`

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm run start` — production build and start
- `npm run lint` — ESLint
- `npm run db:generate` — generate a Drizzle migration from `src/lib/schema.ts`
- `npm run db:push` — push schema changes directly to the DB (dev only)
- `npm run db:seed` — seed/update word data from `data/*.csv`
