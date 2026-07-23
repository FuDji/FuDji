# FuDji

The guest experience layer for independent hosts. FuDji starts where the booking ends — digital
guest guides, room-by-room instructions, QR codes, inventory and maintenance tracking, all in one
premium dashboard.

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · Supabase (Postgres + Auth) ·
React Query · Zod · React Hook Form · Framer Motion · Recharts · `qrcode` · `jspdf`

## Getting started

```bash
pnpm install
cp .env.example .env.local
```

### 1. Create a Supabase project

Create a project at [supabase.com](https://supabase.com), then run the SQL files in
`supabase/migrations/` **in order** (0001, 0002, 0003) via the SQL Editor — they create every
table, RLS policy, and the cleaner-report trigger.

### 2. Configure environment variables

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=          # Project Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Project Settings → API
NEXT_PUBLIC_APP_URL=http://localhost:3000
ANTHROPIC_API_KEY=                 # optional — powers the AI concierge; falls back to a
                                    # simple keyword search over the guide content if unset
```

### 3. Run it

```bash
pnpm dev
```

## Deploying without GitHub

You can deploy straight from this folder with the Vercel CLI — no repo required:

```bash
npx vercel
```

Add the environment variables above in the Vercel project settings (Production + Preview), then
redeploy.

## Project structure

- `src/app/(auth)` — login, register, forgot/reset password, email verification
- `src/app/dashboard`, `src/app/apartments` — owner-facing app, global shell
- `src/app/apartments/[slug]/*` — per-apartment sections (Overview, Guest Guide, Room Guides,
  QR Codes, Inventory, Maintenance, Analytics, Print Center, Settings)
- `src/app/g/[slug]` — public, no-login guest page (mobile-first)
- `src/app/qr/[slug]` — QR redirect + scan-tracking route
- `src/app/api/concierge` — AI concierge endpoint
- `src/lib/data/*` — Supabase data-access functions
- `src/lib/pdf/*` — Print Center PDF templates
- `supabase/migrations/*` — database schema, RLS policies, triggers

## Notes

- Every room and room item automatically gets its own permanent QR code (`/qr/[slug]`) that
  redirects to the current guest-facing content and logs a scan.
- The AI concierge answers only from the apartment's own guide/room content (guest guide sections,
  room instructions, FAQs) — no external knowledge, no booking data.
- Analytics deliberately excludes booking revenue, per product scope.
