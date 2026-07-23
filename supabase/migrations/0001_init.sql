-- FuDji core schema
-- Enable extensions
create extension if not exists "pgcrypto";

-- ============================================================================
-- PROFILES
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- APARTMENTS
-- ============================================================================
create table if not exists public.apartments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  slug text not null unique,
  logo_url text,
  hero_image_url text,
  address text,
  country text,
  city text,
  lat double precision,
  lng double precision,
  phone text,
  email text,
  check_in_time text default '15:00',
  check_out_time text default '11:00',
  wifi_name text,
  wifi_password text,
  parking_info text,
  description text,
  brand_color text default '#4F8CFF',
  font text default 'Inter',
  language text default 'en',
  custom_domain text,
  timezone text default 'UTC',
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists apartments_owner_id_idx on public.apartments (owner_id);

create table if not exists public.apartment_gallery (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments (id) on delete cascade,
  url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments (id) on delete cascade,
  label text not null,
  phone text not null,
  notes text,
  position integer not null default 0
);

-- ============================================================================
-- GUEST GUIDE
-- ============================================================================
create table if not exists public.guide_sections (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments (id) on delete cascade,
  key text not null, -- e.g. 'welcome', 'wifi', 'house_rules', custom slug
  title text not null,
  icon text default 'Sparkles',
  position integer not null default 0,
  published boolean not null default true,
  blocks jsonb not null default '[]'::jsonb, -- array of content blocks
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (apartment_id, key)
);

create index if not exists guide_sections_apartment_id_idx on public.guide_sections (apartment_id);

-- ============================================================================
-- ROOM GUIDES
-- ============================================================================
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments (id) on delete cascade,
  name text not null,
  icon text default 'DoorOpen',
  cover_image_url text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rooms_apartment_id_idx on public.rooms (apartment_id);

create table if not exists public.room_items (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  name text not null,
  icon text default 'Wrench',
  images jsonb not null default '[]'::jsonb,
  instructions text,
  video_url text,
  warnings text,
  tips text,
  faqs jsonb not null default '[]'::jsonb, -- [{question, answer}]
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists room_items_room_id_idx on public.room_items (room_id);

-- ============================================================================
-- QR CODES
-- ============================================================================
create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments (id) on delete cascade,
  target_type text not null check (target_type in ('apartment', 'guide_section', 'room', 'room_item')),
  target_id uuid not null,
  label text not null,
  slug text not null unique,
  style jsonb not null default '{}'::jsonb,
  scan_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists qr_codes_apartment_id_idx on public.qr_codes (apartment_id);

create table if not exists public.qr_scans (
  id uuid primary key default gen_random_uuid(),
  qr_code_id uuid not null references public.qr_codes (id) on delete cascade,
  scanned_at timestamptz not null default now(),
  user_agent text,
  referrer text,
  country text
);

create index if not exists qr_scans_qr_code_id_idx on public.qr_scans (qr_code_id);

-- ============================================================================
-- INVENTORY
-- ============================================================================
create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments (id) on delete cascade,
  category text not null check (
    category in ('kitchen', 'bathroom', 'bedroom', 'living_room', 'outdoor', 'cleaning_supplies')
  ),
  name text not null,
  photo_url text,
  quantity integer not null default 1,
  min_quantity integer not null default 1,
  location text,
  notes text,
  status text not null default 'ok' check (status in ('ok', 'low', 'missing', 'broken', 'needs_replacement')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inventory_items_apartment_id_idx on public.inventory_items (apartment_id);

create table if not exists public.inventory_reports (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.inventory_items (id) on delete cascade,
  reported_by text,
  type text not null check (type in ('missing', 'broken', 'needs_replacement')),
  notes text,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- MAINTENANCE
-- ============================================================================
create table if not exists public.maintenance_issues (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments (id) on delete cascade,
  room_id uuid references public.rooms (id) on delete set null,
  title text not null,
  description text,
  category text not null check (
    category in ('electrical', 'water', 'furniture', 'appliances', 'cleaning', 'safety', 'other')
  ),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  photo_url text,
  video_url text,
  assigned_to text,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists maintenance_issues_apartment_id_idx on public.maintenance_issues (apartment_id);

create table if not exists public.maintenance_events (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.maintenance_issues (id) on delete cascade,
  type text not null, -- 'created' | 'status_change' | 'comment' | 'assigned'
  note text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ANALYTICS: guide views
-- ============================================================================
create table if not exists public.guide_views (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments (id) on delete cascade,
  section_id uuid references public.guide_sections (id) on delete cascade,
  viewed_at timestamptz not null default now(),
  session_id text
);

create index if not exists guide_views_apartment_id_idx on public.guide_views (apartment_id);

-- ============================================================================
-- AI CONCIERGE
-- ============================================================================
create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments (id) on delete cascade,
  session_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- NOTIFICATION PREFERENCES
-- ============================================================================
create table if not exists public.notification_preferences (
  apartment_id uuid primary key references public.apartments (id) on delete cascade,
  email_maintenance boolean not null default true,
  email_inventory boolean not null default true,
  email_guest_activity boolean not null default false,
  email_weekly_report boolean not null default true
);

-- ============================================================================
-- updated_at triggers
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array['apartments','guide_sections','rooms','room_items','inventory_items','maintenance_issues','profiles']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute procedure public.set_updated_at();', t);
  end loop;
end $$;
