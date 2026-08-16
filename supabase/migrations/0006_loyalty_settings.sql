-- Singleton settings row controlling the loyalty program's earn rate.
-- Points were previously only ever spent (redemptions), never earned —
-- this migration also backfills the earning side in application code.
create table if not exists public.platform_settings (
  id boolean primary key default true,
  loyalty_rsd_per_point integer not null default 100 check (loyalty_rsd_per_point > 0),
  constraint platform_settings_singleton check (id)
);

insert into public.platform_settings (id) values (true) on conflict (id) do nothing;

alter table public.platform_settings enable row level security;

create policy "platform_settings_read_all" on public.platform_settings for select using (true);
create policy "platform_settings_admin_write" on public.platform_settings for all
  using (public.is_admin()) with check (public.is_admin());
