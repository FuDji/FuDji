-- Track exactly when an order was confirmed delivered to the company, so
-- admin can show a real timestamp instead of just a status badge.
alter table public.orders add column if not exists delivered_at timestamptz;
