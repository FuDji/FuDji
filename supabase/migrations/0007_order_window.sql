-- How many days ahead employees are allowed to place orders (was hardcoded to 14 in the app).
alter table public.platform_settings
  add column if not exists order_window_days integer not null default 7
  check (order_window_days between 1 and 60);
