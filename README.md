# VNPH Dashboard

Admin dashboard for **VNPH** — a database of Vietnamese football legends, players, clubs, and national teams, inspired by [PES Miti del Calcio](http://www.pesmitidelcalcio.com/).

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database & Auth | Supabase (Postgres + Storage) |
| Hosting | Vercel |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase project credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 3. Set up the database

Run every file in [`supabase/migrations/`](./supabase/migrations) in order, top to bottom, in the Supabase SQL Editor. See that folder's [README](./supabase/migrations/README.md) for details.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## Project Structure

```
vnph-dashboard
├─ app
│  ├─ dashboard
│  │  ├─ awards
│  │  │  └─ page.tsx
│  │  ├─ clubs
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ national-teams
│  │  │  └─ page.tsx
│  │  ├─ page.tsx
│  │  ├─ players
│  │  │  ├─ new
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [id]
│  │  │     ├─ awards
│  │  │     │  └─ page.tsx
│  │  │     ├─ career-events
│  │  │     │  └─ page.tsx
│  │  │     ├─ club-history
│  │  │     │  └─ page.tsx
│  │  │     ├─ edit
│  │  │     │  └─ page.tsx
│  │  │     ├─ layout.tsx
│  │  │     ├─ media
│  │  │     │  └─ page.tsx
│  │  │     ├─ national-team
│  │  │     │  └─ page.tsx
│  │  │     ├─ nicknames
│  │  │     │  └─ page.tsx
│  │  │     ├─ page.tsx
│  │  │     ├─ stats-cards
│  │  │     │  ├─ new
│  │  │     │  │  └─ page.tsx
│  │  │     │  ├─ page.tsx
│  │  │     │  └─ [cardId]
│  │  │     │     └─ edit
│  │  │     │        └─ page.tsx
│  │  │     └─ trophies
│  │  │        └─ page.tsx
│  │  ├─ profiles
│  │  │  └─ page.tsx
│  │  └─ trophies
│  │     └─ page.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components
│  ├─ CreateButton.tsx
│  ├─ DateInput.tsx
│  ├─ Modal.tsx
│  ├─ PageContainer.tsx
│  ├─ PageHeader.tsx
│  ├─ PlayerForm.tsx
│  ├─ PlayerSubNav.tsx
│  ├─ PlayerTable.tsx
│  ├─ RowActions.tsx
│  ├─ SearchableSelect.tsx
│  ├─ Sidebar.tsx
│  ├─ StatsCard.tsx
│  ├─ StatsCardForm.tsx
│  └─ TableWrapper.tsx
├─ eslint.config.mjs
├─ lib
│  ├─ actions
│  │  ├─ awards.ts
│  │  ├─ career-events.ts
│  │  ├─ clubs.ts
│  │  ├─ national-teams.ts
│  │  ├─ player-awards.ts
│  │  ├─ player-club-history.ts
│  │  ├─ player-media.ts
│  │  ├─ player-national-team.ts
│  │  ├─ player-nicknames.ts
│  │  ├─ player-stats-cards.ts
│  │  ├─ player-trophies.ts
│  │  ├─ players.ts
│  │  ├─ profiles.ts
│  │  ├─ storage.ts
│  │  └─ trophies.ts
│  ├─ countries.ts
│  ├─ date-helpers.ts
│  ├─ db
│  │  ├─ awards.ts
│  │  ├─ career-events.ts
│  │  ├─ club-select.ts
│  │  ├─ clubs.ts
│  │  ├─ dashboard.ts
│  │  ├─ national-team.ts
│  │  ├─ player-awards.ts
│  │  ├─ player-club-history.ts
│  │  ├─ player-media.ts
│  │  ├─ player-national-team.ts
│  │  ├─ player-nicknames.ts
│  │  ├─ player-stats-cards.ts
│  │  ├─ player-trophies.ts
│  │  ├─ players.ts
│  │  ├─ profiles.ts
│  │  └─ tropies.ts
│  ├─ supabase-admin.ts
│  ├─ supabase-client.ts
│  └─ supabase-server.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ supabase
│  └─ migrations
│     ├─ 001_initial-extended_schema.sql
│     ├─ 002_sample_reference_data.sql
│     ├─ 003_revamp_stats_card_fm_attributes.sql
│     ├─ 004_rls_policies_player_subresources.sql
│     ├─ 005_storage_bucket_policies.sql
│     └─ 006_add_personality_hidden_attributes.sql
└─ tsconfig.json

```

### The pattern every resource follows

Every data type in this app (clubs, trophies, players, nicknames, club history, etc.) is built the same way:

```
lib/db/<resource>.ts        → read queries (uses anon client)
lib/actions/<resource>.ts   → create / update / delete (uses admin client)
app/.../page.tsx            → UI built from CreateButton + RowActions
```

Player sub-resources (nicknames, trophies, career events, etc.) follow this same pattern, scoped under `app/dashboard/players/[id]/<resource>/page.tsx`, with every action bound to that player's ID before being passed to the UI.

When adding something new, follow this shape rather than improvising — it's what keeps the codebase predictable as it grows.

---

## Key Concepts

- **Two Supabase clients.** `lib/supabase-server.ts` (anon key, respects RLS) is used for all reads. `lib/supabase-admin.ts` (service role key, bypasses RLS) is used for all writes via server actions. There's no end-user authentication yet — every write currently goes through the admin client.
- **RLS policies.** Every table has public `SELECT` and admin-only `INSERT/UPDATE/DELETE` policies. New tables need policies added immediately — see [`supabase/migrations/README.md`](./supabase/migrations/README.md).
- **Image uploads.** Logos and photos upload directly to Supabase Storage (`club-logos`, `national-team-logos`, `player-photos` buckets) rather than pasting external URLs — see `lib/actions/storage.ts`.
- **Dates.** Always displayed and entered as `dd/mm/yyyy` via `DateInputDDMMYYYY`, stored as ISO (`yyyy-mm-dd`) in Postgres. Never use a native `<input type="date">` — see `lib/date-helpers.ts`.

For the reasoning behind these and other choices, see [`DECISIONS.md`](./DECISIONS.md).

---

## Deployment

Connected to Vercel — every push to `main` triggers an automatic redeploy. Make sure the three environment variables above are also set in **Vercel → Project Settings → Environment Variables** for Production.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)