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
vnph-dashboard/
├─ app/
│  ├─ dashboard/                 # All admin pages live here
│  │  ├─ awards/                 # Awards reference table
│  │  ├─ clubs/                  # Clubs reference table
│  │  ├─ national-teams/         # National teams reference table
│  │  ├─ trophies/               # Trophies reference table
│  │  ├─ profiles/               # User/admin profiles
│  │  ├─ players/
│  │  │  ├─ page.tsx             # Players list (search + filter)
│  │  │  ├─ new/                 # Create player form
│  │  │  └─ [id]/                # Player hub — one player's full record
│  │  │     ├─ layout.tsx        # Shared header + sub-nav tabs
│  │  │     ├─ edit/             # Edit player identity/physical/career/media
│  │  │     ├─ nicknames/
│  │  │     ├─ club-history/
│  │  │     ├─ national-team/
│  │  │     ├─ trophies/
│  │  │     ├─ awards/
│  │  │     ├─ career-events/
│  │  │     ├─ media/
│  │  │     └─ stats-cards/      # FM-style attribute ratings (51 fields)
│  │  └─ layout.tsx              # Sidebar + page shell
│  └─ layout.tsx                 # Root layout
│
├─ components/                   # Shared UI building blocks
│  ├─ CreateButton.tsx           # Generic "add new record" modal
│  ├─ RowActions.tsx             # Generic edit/delete actions per row
│  ├─ PlayerForm.tsx             # Tabbed player create/edit form
│  ├─ PlayerSubNav.tsx           # Tab bar inside the player hub
│  ├─ DateInputDDMMYYYY.tsx      # dd/mm/yyyy date input (replaces native <input type="date">)
│  └─ ...
│
├─ lib/
│  ├─ db/                        # Read queries — one file per resource
│  ├─ actions/                   # Server actions (create/update/delete) — one file per resource
│  ├─ date-helpers.ts            # dd/mm/yyyy <-> ISO conversion utilities
│  ├─ supabase-server.ts         # Server-side Supabase client (anon key, respects RLS)
│  └─ supabase-admin.ts          # Admin Supabase client (service role, bypasses RLS)
│
├─ supabase/
│  └─ migrations/                # Numbered SQL migration history — see its own README
│
├─ DECISIONS.md                  # Log of non-obvious architecture decisions
└─ .env.example                  # Required environment variables (no real values)
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