-- Prime Bite core schema
create extension if not exists "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================
do $$ begin
  create type public.user_role as enum ('employee', 'office_manager', 'restaurant_staff', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_type as enum ('company_pays', 'employee_pays', 'mixed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum ('pending', 'accepted', 'rejected', 'preparing', 'ready', 'delivered');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.entity_status as enum ('active', 'inactive');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.invitation_status as enum ('pending', 'accepted', 'revoked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.delivery_status as enum ('scheduled', 'delayed', 'delivered');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- COMPANIES (Firme)
-- ============================================================================
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  contact_phone text,
  contact_email text,
  payment_type public.payment_type not null default 'company_pays',
  daily_budget numeric(10, 2) not null default 800,
  monthly_budget numeric(10, 2),
  mixed_cap numeric(10, 2),
  cutoff_time time not null default '10:30',
  delivery_time time not null default '12:00',
  delivery_tolerance_minutes integer not null default 15,
  status public.entity_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- RESTAURANTS
-- ============================================================================
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  address text,
  phone text,
  description text,
  commission_percent numeric(5, 2) not null default 0,
  status public.entity_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- PROFILES (all portal users)
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role public.user_role not null default 'employee',
  company_id uuid references public.companies (id) on delete set null,
  restaurant_id uuid references public.restaurants (id) on delete set null,
  daily_budget_override numeric(10, 2),
  loyalty_points integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_company_id_idx on public.profiles (company_id);
create index if not exists profiles_restaurant_id_idx on public.profiles (restaurant_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- INVITATIONS (email-invite onboarding)
-- ============================================================================
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies (id) on delete cascade,
  restaurant_id uuid references public.restaurants (id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'employee',
  daily_budget_override numeric(10, 2),
  token uuid not null default gen_random_uuid() unique,
  status public.invitation_status not null default 'pending',
  invited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create index if not exists invitations_company_id_idx on public.invitations (company_id);
create index if not exists invitations_email_idx on public.invitations (email);

-- ============================================================================
-- RESTAURANT WEEKLY SCHEDULE (which restaurants work which day + capacity)
-- ============================================================================
create table if not exists public.restaurant_schedule (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  date date not null,
  is_open boolean not null default true,
  meal_limit integer not null default 50,
  created_at timestamptz not null default now(),
  unique (restaurant_id, date)
);

create index if not exists restaurant_schedule_date_idx on public.restaurant_schedule (date);

-- ============================================================================
-- MENU ITEMS
-- ============================================================================
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  name text not null,
  description text,
  image_url text,
  calories integer,
  price numeric(10, 2) not null default 0,
  category text default 'main',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists menu_items_restaurant_id_idx on public.menu_items (restaurant_id);

-- daily availability + "deal of the day" (e.g. Taco Monday)
create table if not exists public.daily_menu (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  menu_item_id uuid not null references public.menu_items (id) on delete cascade,
  date date not null,
  is_available boolean not null default true,
  is_deal_of_day boolean not null default false,
  deal_label text,
  deal_price numeric(10, 2),
  created_at timestamptz not null default now(),
  unique (restaurant_id, menu_item_id, date)
);

create index if not exists daily_menu_date_idx on public.daily_menu (date);
create index if not exists daily_menu_restaurant_date_idx on public.daily_menu (restaurant_id, date);

-- ============================================================================
-- ORDERS
-- ============================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  employee_id uuid not null references public.profiles (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  order_date date not null,
  status public.order_status not null default 'pending',
  rejection_reason text,
  prep_time_minutes integer,
  note text,
  subtotal numeric(10, 2) not null default 0,
  company_covered numeric(10, 2) not null default 0,
  employee_paid numeric(10, 2) not null default 0,
  locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, order_date)
);

create index if not exists orders_company_date_idx on public.orders (company_id, order_date);
create index if not exists orders_restaurant_date_idx on public.orders (restaurant_id, order_date);
create index if not exists orders_employee_idx on public.orders (employee_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  menu_item_id uuid references public.menu_items (id) on delete set null,
  name_snapshot text not null,
  price_snapshot numeric(10, 2) not null default 0,
  calories_snapshot integer,
  quantity integer not null default 1,
  note text
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ============================================================================
-- CAMPAIGNS (Akcije)
-- ============================================================================
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  campaign_type text not null default 'discount' check (
    campaign_type in ('discount', 'free_item', 'free_delivery', 'other')
  ),
  discount_percent numeric(5, 2),
  restaurant_id uuid references public.restaurants (id) on delete cascade,
  starts_at date not null default current_date,
  ends_at date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists campaigns_active_idx on public.campaigns (active);

-- ============================================================================
-- LOYALTY
-- ============================================================================
create table if not exists public.loyalty_rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  points_cost integer not null default 100,
  reward_type text not null default 'other' check (
    reward_type in ('free_meal', 'dessert', 'drink', 'other')
  ),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.loyalty_redemptions (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.profiles (id) on delete cascade,
  reward_id uuid not null references public.loyalty_rewards (id) on delete cascade,
  points_spent integer not null,
  status text not null default 'redeemed' check (status in ('pending', 'redeemed')),
  created_at timestamptz not null default now()
);

create index if not exists loyalty_redemptions_employee_idx on public.loyalty_redemptions (employee_id);

-- ============================================================================
-- RATINGS
-- ============================================================================
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete cascade,
  employee_id uuid not null references public.profiles (id) on delete cascade,
  delivery_rating smallint check (delivery_rating between 1 and 5),
  food_rating smallint check (food_rating between 1 and 5),
  system_rating smallint check (system_rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- DELIVERIES (per company / day)
-- ============================================================================
create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  delivery_date date not null,
  scheduled_at timestamptz not null,
  delivered_at timestamptz,
  status public.delivery_status not null default 'scheduled',
  created_at timestamptz not null default now(),
  unique (company_id, delivery_date)
);

create index if not exists deliveries_date_idx on public.deliveries (delivery_date);

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
  foreach t in array array['companies','restaurants','profiles','menu_items','orders']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute procedure public.set_updated_at();', t);
  end loop;
end $$;

-- award loyalty points (1 point per 100 RSD) when an order is marked delivered
create or replace function public.award_loyalty_points()
returns trigger as $$
begin
  if new.status = 'delivered' and old.status is distinct from 'delivered' then
    update public.profiles
    set loyalty_points = loyalty_points + greatest(floor(new.subtotal / 100), 1)::integer
    where id = new.employee_id;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_order_delivered on public.orders;
create trigger on_order_delivered
  after update on public.orders
  for each row execute procedure public.award_loyalty_points();
