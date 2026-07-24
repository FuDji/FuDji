import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getOwnedApartment, listEmergencyContacts, listGalleryImages } from "@/lib/data/apartments";
import { listGuideSections } from "@/lib/data/guide";
import { listRooms } from "@/lib/data/rooms";
import { listInventoryItems } from "@/lib/data/inventory";
import { listQrCodes } from "@/lib/data/qr-list";
import { PageHeader } from "@/components/layout/page-header";
import { PrintGrid } from "@/components/print/print-grid";

export default async function PrintCenterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user } = await requireUser();
  const apartment = await getOwnedApartment(supabase, slug, user.id);
  if (!apartment) notFound();

  const [sections, rooms, contacts, inventoryItems, qrCodes, gallery] = await Promise.all([
    listGuideSections(supabase, apartment.id),
    listRooms(supabase, apartment.id),
    listEmergencyContacts(supabase, apartment.id),
    listInventoryItems(supabase, apartment.id),
    listQrCodes(supabase, apartment.id),
    listGalleryImages(supabase, apartment.id),
  ]);

  const parkingImageUrl = gallery[0]?.url ?? apartment.hero_image_url;

  return (
    <div>
      <PageHeader
        title="Print Center"
        description="Lepi, štampi-spremni PDF-ovi — od knjige dobrodošlice do QR postera."
      />
      <PrintGrid
        apartment={apartment}
        sections={sections}
        rooms={rooms}
        contacts={contacts}
        inventoryItems={inventoryItems}
        qrCodes={qrCodes}
        parkingImageUrl={parkingImageUrl}
      />
    </div>
  );
}
