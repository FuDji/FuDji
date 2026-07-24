import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getOwnedApartment } from "@/lib/data/apartments";
import { listInventoryItems } from "@/lib/data/inventory";
import { PageHeader } from "@/components/layout/page-header";
import { ItemDialog } from "@/components/inventory/item-dialog";
import { InventoryTabs } from "@/components/inventory/inventory-tabs";

export default async function InventoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user } = await requireUser();
  const apartment = await getOwnedApartment(supabase, slug, user.id);
  if (!apartment) notFound();

  const items = await listInventoryItems(supabase, apartment.id);

  return (
    <div>
      <PageHeader
        title="Inventar"
        description="Sve što treba da postoji u ovom apartmanu i njegovo trenutno stanje."
        actions={<ItemDialog apartmentId={apartment.id} slug={slug} />}
      />
      <InventoryTabs apartmentId={apartment.id} slug={slug} items={items} />
    </div>
  );
}
