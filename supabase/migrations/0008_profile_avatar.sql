-- Self-service profile picture (URL-based, matching the image_url convention
-- already used for menu items / restaurant logos elsewhere in this schema).
alter table public.profiles add column if not exists avatar_url text;
