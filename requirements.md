# German Learning Cards — Requirements

## 1. Purpose

A flashcard web app to help the user practice German vocabulary (verbs, nouns,
adjectives) sourced from the TELC B1 word lists in `data/`. The user is shown
a German word, tries to recall its meaning/forms, flips the card to check,
and marks whether they got it right. The app tracks performance over time.

Single user, personal project. Deployed on Vercel (free tier), code hosted
on GitHub.

## 2. Data Sources

Static CSV files in `data/`, committed to the repo:

- `telc_b1_verbs.csv` (300 rows) — Infinitiv, Präteritum, Partizip II,
  English/Turkish meaning, ich/du conjugation, a sample sentence (+ EN
  translation) for each of the three forms.
- `telc_b1_nouns.csv` (417 rows) — Noun, Artikel, English/Turkish meaning, 2
  sample sentences with case labels.
- `telc_b1_adjectives.csv` (50 rows) — Adjective, English/Turkish meaning,
  Opposite, Comparative/Superlative (+ sentences), 2 sample sentences with
  case labels.

Known data quality issues (not blocking for v1, worth revisiting later):
- Some verb sample sentences appear to be mechanically generated and are
  grammatically/translation-broken (e.g. "Gestern fuhr ab er mit großer
  Sorgfalt." / "Yesterday he to depart with great care.").

Word data is treated as static content for v1: no in-app create/edit/delete
of words. Updating the CSVs and re-seeding is the expected workflow if the
word lists change.

## 3. Core User Flow

1. **Type selection** — user selects one or more of: Verbs, Nouns,
   Adjectives. At least one must be selected to start.
2. **Session starts** — a session pool is built from all words belonging to
   the selected type(s), merged into a single shuffled pool (not drawn type
   by type).
3. **Card shown (front)** — displays the German word only (Infinitiv for
   verbs, Artikel + Noun for nouns, Adjective for adjectives). User tries to
   recall the meaning/forms.
4. **Flip** — user taps/clicks to flip the card and see the detail view:
   - Verb: Infinitiv, Präteritum, Partizip II, English + Turkish meaning,
     ich/du conjugation, sample sentences (+ translations) for each form.
   - Noun: Artikel + Noun, English + Turkish meaning, sample sentences (+
     translations, case labels).
   - Adjective: Adjective, English + Turkish meaning, Opposite,
     Comparative/Superlative (+ sentences), sample sentences (+
     translations, case labels).
5. **Answer** — after flipping, user marks the card **Correct** or
   **Wrong**.
   - **Correct**: card is removed from the session pool; it will not be
     shown again this session.
   - **Wrong**: card is requeued back into the pool to be shown again later
     in the same session. A card can be requeued multiple times; it keeps
     reappearing until the user eventually answers it correctly.
6. **Next card** — a new random card is drawn from the remaining pool
   (correctly-answered cards excluded, wrong cards still included).
7. **Session end** — the session ends automatically once every word in the
   pool has been answered correctly at least once (pool empty). The user can
   also end a session early at any time.
8. **Restart** — ending a session (automatically or manually) returns the
   user to the type-selection screen to start a new session.

## 4. Stats & History

Every answer (correct/wrong) and every session is recorded so the user can
review performance over time. Required views/metrics:

- **Per-session summary**: types practiced, total cards, number of distinct
  words, correct count, wrong count (including repeats), total wrong
  attempts per word, time to complete the session, start/end timestamps.
- **Historical trends**: how session duration, accuracy, etc. change over
  multiple sessions over time (e.g. a simple chart/table across sessions).
- **Most problematic words**: words with the highest wrong-attempt counts,
  aggregated across all historical sessions (not just one session).
- Stats are tracked per word across its lifetime in the app, not reset
  between sessions.

### Persistence

Stats and session history are stored in a backend database (not
browser-only storage), so history is consistent regardless of device/browser
used. Word content (from the CSVs) is also loaded into the database (seeded
from CSV) so the app can run entirely off the DB at request time.

## 5. Access Control

The app is protected by a single shared password (app-level), since it will
be deployed on a public Vercel URL with a real database behind it. No
per-user accounts — this is a single-user app. The password is stored as an
environment variable, not committed to the repo.

## 6. Non-Functional Requirements

- **Responsive / mobile-friendly**: must work well on phone-sized screens as
  well as desktop (touch-friendly flip and answer controls).
- **Hosting**: GitHub for source control, deployed to Vercel (free tier).
- **Database**: a free-tier-compatible backend database reachable from
  Vercel (e.g. Vercel Postgres/Neon).
- **Performance**: word lists are small (≤ ~400 rows total); no special
  performance concerns expected.

## 7. Out of Scope (v1)

- In-app editing/creation of words or word lists.
- Multi-user support / accounts / login beyond the single shared password.
- Spaced-repetition scheduling (e.g. SM-2) — v1 uses simple random draw +
  requeue-on-wrong within a session only.
- Audio pronunciation.
- Offline support / PWA installability (may revisit later).

## 8. Open Items for Planning Phase

- Exact tech stack (framework, ORM, specific DB provider) to be finalized
  during planning.
- Exact DB schema (words, sessions, answers tables).
- Visual/UI design direction.
