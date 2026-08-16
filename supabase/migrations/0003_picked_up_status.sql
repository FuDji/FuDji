-- Add a "picked up by courier" step between "ready" and "delivered". The
-- restaurant's job ends at handing the order to the courier; only admin
-- confirms final delivery to the company from there.
--
-- Run this file by itself (as its own "Run" in the SQL editor) — Postgres
-- does not allow a new enum value to be used in the same transaction that
-- adds it, so it needs to be committed before 0004 can reference it.
alter type public.order_status add value if not exists 'picked_up' after 'ready';
