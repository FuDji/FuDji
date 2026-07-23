-- Row Level Security
alter table public.profiles enable row level security;
alter table public.apartments enable row level security;
alter table public.apartment_gallery enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.guide_sections enable row level security;
alter table public.rooms enable row level security;
alter table public.room_items enable row level security;
alter table public.qr_codes enable row level security;
alter table public.qr_scans enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_reports enable row level security;
alter table public.maintenance_issues enable row level security;
alter table public.maintenance_events enable row level security;
alter table public.guide_views enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.notification_preferences enable row level security;

-- profiles: user manages their own row
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- apartments: owner has full access; anonymous guests can read active apartments (needed for public guide page)
create policy "apartments_owner_all" on public.apartments for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "apartments_public_read" on public.apartments for select
  using (status = 'active');

-- helper: is the current user the owner of the apartment referenced by apartment_id?
create or replace function public.owns_apartment(target_apartment_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.apartments a
    where a.id = target_apartment_id and a.owner_id = auth.uid()
  );
$$ language sql security definer stable;

-- apartment_gallery
create policy "gallery_owner_all" on public.apartment_gallery for all
  using (public.owns_apartment(apartment_id)) with check (public.owns_apartment(apartment_id));
create policy "gallery_public_read" on public.apartment_gallery for select using (true);

-- emergency_contacts
create policy "contacts_owner_all" on public.emergency_contacts for all
  using (public.owns_apartment(apartment_id)) with check (public.owns_apartment(apartment_id));
create policy "contacts_public_read" on public.emergency_contacts for select using (true);

-- guide_sections: owner full access, public can read published sections
create policy "guide_sections_owner_all" on public.guide_sections for all
  using (public.owns_apartment(apartment_id)) with check (public.owns_apartment(apartment_id));
create policy "guide_sections_public_read" on public.guide_sections for select
  using (published = true);

-- rooms
create policy "rooms_owner_all" on public.rooms for all
  using (public.owns_apartment(apartment_id)) with check (public.owns_apartment(apartment_id));
create policy "rooms_public_read" on public.rooms for select using (true);

-- room_items (via room -> apartment)
create or replace function public.owns_room(target_room_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.rooms r
    where r.id = target_room_id and public.owns_apartment(r.apartment_id)
  );
$$ language sql security definer stable;

create policy "room_items_owner_all" on public.room_items for all
  using (public.owns_room(room_id)) with check (public.owns_room(room_id));
create policy "room_items_public_read" on public.room_items for select using (true);

-- qr_codes
create policy "qr_codes_owner_all" on public.qr_codes for all
  using (public.owns_apartment(apartment_id)) with check (public.owns_apartment(apartment_id));
create policy "qr_codes_public_read" on public.qr_codes for select using (true);

-- qr_scans: anyone (including anon) can insert a scan event; only owner can read
create policy "qr_scans_public_insert" on public.qr_scans for insert with check (true);
create policy "qr_scans_owner_read" on public.qr_scans for select
  using (exists (
    select 1 from public.qr_codes q where q.id = qr_code_id and public.owns_apartment(q.apartment_id)
  ));

-- inventory
create policy "inventory_items_owner_all" on public.inventory_items for all
  using (public.owns_apartment(apartment_id)) with check (public.owns_apartment(apartment_id));

create policy "inventory_reports_owner_read" on public.inventory_reports for select
  using (exists (
    select 1 from public.inventory_items i where i.id = item_id and public.owns_apartment(i.apartment_id)
  ));
create policy "inventory_reports_public_insert" on public.inventory_reports for insert with check (true);
create policy "inventory_reports_owner_update" on public.inventory_reports for update
  using (exists (
    select 1 from public.inventory_items i where i.id = item_id and public.owns_apartment(i.apartment_id)
  ));

-- maintenance
create policy "maintenance_issues_owner_all" on public.maintenance_issues for all
  using (public.owns_apartment(apartment_id)) with check (public.owns_apartment(apartment_id));

create policy "maintenance_events_owner_all" on public.maintenance_events for all
  using (exists (
    select 1 from public.maintenance_issues m where m.id = issue_id and public.owns_apartment(m.apartment_id)
  ));

-- guide_views: anyone can insert (guest page view tracking), owner can read
create policy "guide_views_public_insert" on public.guide_views for insert with check (true);
create policy "guide_views_owner_read" on public.guide_views for select
  using (public.owns_apartment(apartment_id));

-- ai_conversations / ai_messages: public insert+read via session (guest chat), owner read-all
create policy "ai_conversations_public_all" on public.ai_conversations for all using (true) with check (true);
create policy "ai_messages_public_all" on public.ai_messages for all using (true) with check (true);

-- notification_preferences
create policy "notification_prefs_owner_all" on public.notification_preferences for all
  using (public.owns_apartment(apartment_id)) with check (public.owns_apartment(apartment_id));
