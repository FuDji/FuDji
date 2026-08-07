-- Fixes based on real-world usage feedback. Run 0003 first.

-- ============================================================================
-- restaurant_staff couldn't read the companies that ordered from them —
-- there was no SELECT policy on `companies` for that role at all, so the
-- `company:companies(name)` embed in restaurant order queries silently
-- resolved to null under RLS ("Nepoznata firma" for every order).
-- ============================================================================
create policy "companies_restaurant_read_via_orders" on public.companies for select
  using (exists (
    select 1 from public.orders o
    where o.company_id = companies.id and o.restaurant_id = public.current_restaurant_id()
  ));

-- ============================================================================
-- Deleting an employee shouldn't destroy their order history (financial
-- records / invoices need to stay accurate). Snapshot their name at order
-- time — same pattern already used for menu item name/price on
-- order_items — and let employee_id go null instead of cascading.
-- ============================================================================
alter table public.orders add column if not exists employee_name_snapshot text;

update public.orders o
set employee_name_snapshot = p.full_name
from public.profiles p
where p.id = o.employee_id and o.employee_name_snapshot is null;

alter table public.orders alter column employee_id drop not null;
alter table public.orders drop constraint if exists orders_employee_id_fkey;
alter table public.orders
  add constraint orders_employee_id_fkey
  foreign key (employee_id) references public.profiles (id) on delete set null;
