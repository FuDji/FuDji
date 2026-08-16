# Prime Bite

Naručivanje obroka za firme. Prime Bite povezuje zaposlene, office menadžere, restorane i
administratore u jednu platformu: nedeljni meniji unapred, budžeti po firmi/zaposlenom, potvrda
narudžbina od strane restorana i praćenje dostave.

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · Supabase (Postgres + Auth) ·
React Query · Zod · React Hook Form · Framer Motion · Recharts · `xlsx`

## Portali

- **Zaposleni** (`/app`) — ponuda dana, nedeljni meni i naručivanje, status narudžbine, akcije,
  loyalty nagrade.
- **Office menadžer** (`/company`) — zaposleni (pojedinačno ili bulk uvoz iz Excela), budžeti,
  troškovi, istorija narudžbina.
- **Restoran** (`/restaurant`) — dolazne narudžbine za danas/sutra, prihvatanje/odbijanje,
  upravljanje menijem i dnevnim kapacitetom.
- **Admin** (`/admin`) — firme, restorani, nedeljno planiranje, kampanje, praćenje dostave,
  Excel export, sve narudžbine.

## Getting started

```bash
pnpm install
cp .env.example .env.local
```

### 1. Create a Supabase project

Create a project at [supabase.com](https://supabase.com), then run the SQL files in
`supabase/migrations/` **in order** (0001, 0002) via the SQL Editor — they create every table, enum,
RLS policy and trigger.

### 2. Configure environment variables

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=          # Project Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Project Settings → API
SUPABASE_SERVICE_ROLE_KEY=         # Project Settings → API (server-only — invites, admin ops)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Bootstrap the first admin

There is no public sign-up — every account is created by an invite. To get the very first admin
account in, insert one row directly in the Supabase SQL editor after creating your own
`auth.users` entry (Authentication → Users → Add user), then:

```sql
update public.profiles set role = 'admin' where email = 'you@company.com';
```

From there, the admin portal can invite everyone else (companies' office managers, restaurant
staff, and — via each office manager — employees).

### 4. Run it

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

- `src/app/(auth)` — login, forgot/reset password, invite acceptance
- `src/app/app` — employee portal
- `src/app/company` — office manager portal
- `src/app/restaurant` — restaurant portal
- `src/app/admin` — admin portal
- `src/lib/supabase/*` — browser/server/admin Supabase clients + auth middleware
- `supabase/migrations/*` — database schema, enums, RLS policies, triggers

## Notes / known simplifications

- **Invitations don't send real email.** Accepting an invite creates the auth user directly via
  the service-role client; the office manager / admin UI surfaces a copyable invite link instead
  of dispatching email. Wire up a transactional email provider (e.g. Resend) in
  `src/app/(auth)/actions.ts` and the invite-creation actions to send it for real.
  30-minute-before-cutoff and daily-deal emails described in the spec are likewise not wired to a
  sender yet.
- **Bulk employee upload** reads `.xlsx`/`.csv` client-side (columns: `full_name`, `email`,
  optional `daily_budget_override`) and creates one invitation per row.
- Loyalty points are awarded automatically (1 point per 100 RSD) when an order is marked
  *delivered*.
