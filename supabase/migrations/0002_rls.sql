-- Row Level Security

-- ============================================================================
-- HELPERS (security definer so they can read profiles without recursive RLS)
-- ============================================================================
create or replace function public.current_role()
returns public.user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer stable set search_path = public;

create or replace function public.current_company_id()
returns uuid as $$
  select company_id from public.profiles where id = auth.uid();
$$ language sql security definer stable set search_path = public;

create or replace function public.current_restaurant_id()
returns uuid as $$
  select restaurant_id from public.profiles where id = auth.uid();
$$ language sql security definer stable set search_path = public;

create or replace function public.is_admin()
returns boolean as $$
  select public.current_role() = 'admin';
$$ language sql security definer stable set search_path = public;

alter table public.companies enable row level security;
alter table public.restaurants enable row level security;
alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.restaurant_schedule enable row level security;
alter table public.menu_items enable row level security;
alter table public.daily_menu enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.campaigns enable row level security;
alter table public.loyalty_rewards enable row level security;
alter table public.loyalty_redemptions enable row level security;
alter table public.ratings enable row level security;
alter table public.deliveries enable row level security;

-- ============================================================================
-- PROFILES
-- ============================================================================
create policy "profiles_select_own" on public.profiles for select
  using (auth.uid() = id);
create policy "profiles_select_company" on public.profiles for select
  using (public.current_role() = 'office_manager' and company_id = public.current_company_id());
create policy "profiles_select_admin" on public.profiles for select
  using (public.is_admin());
create policy "profiles_update_own" on public.profiles for update
  using (auth.uid() = id);
create policy "profiles_office_manager_update_employees" on public.profiles for update
  using (public.current_role() = 'office_manager' and company_id = public.current_company_id());
create policy "profiles_restaurant_read_via_orders" on public.profiles for select
  using (exists (
    select 1 from public.orders o
    where o.employee_id = profiles.id and o.restaurant_id = public.current_restaurant_id()
  ));
create policy "profiles_admin_all" on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- COMPANIES
-- ============================================================================
create policy "companies_select_own_members" on public.companies for select
  using (id = public.current_company_id());
create policy "companies_admin_all" on public.companies for all
  using (public.is_admin()) with check (public.is_admin());
create policy "companies_office_manager_update" on public.companies for update
  using (public.current_role() = 'office_manager' and id = public.current_company_id());

-- ============================================================================
-- RESTAURANTS (public directory — everyone signed in can browse active ones)
-- ============================================================================
create policy "restaurants_read_active" on public.restaurants for select
  using (status = 'active' or public.is_admin() or id = public.current_restaurant_id());
create policy "restaurants_admin_all" on public.restaurants for all
  using (public.is_admin()) with check (public.is_admin());
create policy "restaurants_staff_update" on public.restaurants for update
  using (public.current_role() = 'restaurant_staff' and id = public.current_restaurant_id());

-- ============================================================================
-- INVITATIONS
-- ============================================================================
create policy "invitations_office_manager_all" on public.invitations for all
  using (public.current_role() = 'office_manager' and company_id = public.current_company_id())
  with check (public.current_role() = 'office_manager' and company_id = public.current_company_id());
create policy "invitations_admin_all" on public.invitations for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- RESTAURANT SCHEDULE
-- ============================================================================
create policy "schedule_read_all" on public.restaurant_schedule for select using (true);
create policy "schedule_admin_all" on public.restaurant_schedule for all
  using (public.is_admin()) with check (public.is_admin());
create policy "schedule_staff_write" on public.restaurant_schedule for all
  using (public.current_role() = 'restaurant_staff' and restaurant_id = public.current_restaurant_id())
  with check (public.current_role() = 'restaurant_staff' and restaurant_id = public.current_restaurant_id());

-- ============================================================================
-- MENU ITEMS
-- ============================================================================
create policy "menu_items_read_all" on public.menu_items for select using (true);
create policy "menu_items_admin_all" on public.menu_items for all
  using (public.is_admin()) with check (public.is_admin());
create policy "menu_items_staff_write" on public.menu_items for all
  using (public.current_role() = 'restaurant_staff' and restaurant_id = public.current_restaurant_id())
  with check (public.current_role() = 'restaurant_staff' and restaurant_id = public.current_restaurant_id());

-- ============================================================================
-- DAILY MENU
-- ============================================================================
create policy "daily_menu_read_all" on public.daily_menu for select using (true);
create policy "daily_menu_admin_all" on public.daily_menu for all
  using (public.is_admin()) with check (public.is_admin());
create policy "daily_menu_staff_write" on public.daily_menu for all
  using (public.current_role() = 'restaurant_staff' and restaurant_id = public.current_restaurant_id())
  with check (public.current_role() = 'restaurant_staff' and restaurant_id = public.current_restaurant_id());

-- ============================================================================
-- ORDERS
-- ============================================================================
create policy "orders_employee_all" on public.orders for all
  using (employee_id = auth.uid())
  with check (employee_id = auth.uid());
create policy "orders_office_manager_read" on public.orders for select
  using (public.current_role() = 'office_manager' and company_id = public.current_company_id());
create policy "orders_restaurant_read" on public.orders for select
  using (public.current_role() = 'restaurant_staff' and restaurant_id = public.current_restaurant_id());
create policy "orders_restaurant_update" on public.orders for update
  using (public.current_role() = 'restaurant_staff' and restaurant_id = public.current_restaurant_id());
create policy "orders_admin_all" on public.orders for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- ORDER ITEMS (inherit access via parent order)
-- ============================================================================
create policy "order_items_employee_all" on public.order_items for all
  using (exists (select 1 from public.orders o where o.id = order_id and o.employee_id = auth.uid()))
  with check (exists (select 1 from public.orders o where o.id = order_id and o.employee_id = auth.uid()));
create policy "order_items_office_manager_read" on public.order_items for select
  using (exists (
    select 1 from public.orders o where o.id = order_id
    and public.current_role() = 'office_manager' and o.company_id = public.current_company_id()
  ));
create policy "order_items_restaurant_read" on public.order_items for select
  using (exists (
    select 1 from public.orders o where o.id = order_id
    and public.current_role() = 'restaurant_staff' and o.restaurant_id = public.current_restaurant_id()
  ));
create policy "order_items_admin_all" on public.order_items for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- CAMPAIGNS (public read for active, admin manages)
-- ============================================================================
create policy "campaigns_read_all" on public.campaigns for select using (true);
create policy "campaigns_admin_all" on public.campaigns for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- LOYALTY
-- ============================================================================
create policy "loyalty_rewards_read_all" on public.loyalty_rewards for select using (true);
create policy "loyalty_rewards_admin_all" on public.loyalty_rewards for all
  using (public.is_admin()) with check (public.is_admin());

create policy "loyalty_redemptions_own" on public.loyalty_redemptions for all
  using (employee_id = auth.uid()) with check (employee_id = auth.uid());
create policy "loyalty_redemptions_admin_all" on public.loyalty_redemptions for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- RATINGS
-- ============================================================================
create policy "ratings_employee_all" on public.ratings for all
  using (employee_id = auth.uid()) with check (employee_id = auth.uid());
create policy "ratings_admin_read" on public.ratings for select using (public.is_admin());
create policy "ratings_restaurant_read" on public.ratings for select
  using (exists (
    select 1 from public.orders o where o.id = order_id
    and public.current_role() = 'restaurant_staff' and o.restaurant_id = public.current_restaurant_id()
  ));

-- ============================================================================
-- DELIVERIES
-- ============================================================================
create policy "deliveries_read_company" on public.deliveries for select
  using (company_id = public.current_company_id() or public.is_admin());
create policy "deliveries_admin_all" on public.deliveries for all
  using (public.is_admin()) with check (public.is_admin());
