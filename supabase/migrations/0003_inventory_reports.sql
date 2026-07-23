-- Public read access to inventory items (needed for the no-login cleaner report page)
create policy "inventory_items_public_read" on public.inventory_items for select using (true);

-- When a cleaner submits a report, automatically sync the item's status.
-- Runs as security definer so the anonymous reporter doesn't need direct
-- update rights on inventory_items (RLS still restricts writes to owners).
create or replace function public.sync_inventory_status()
returns trigger as $$
begin
  update public.inventory_items
  set status = new.type
  where id = new.item_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_inventory_report_created on public.inventory_reports;
create trigger on_inventory_report_created
  after insert on public.inventory_reports
  for each row execute procedure public.sync_inventory_status();
