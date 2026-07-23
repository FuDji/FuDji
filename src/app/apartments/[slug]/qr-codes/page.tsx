import { notFound } from "next/navigation";
import { QrCode } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getOwnedApartment } from "@/lib/data/apartments";
import { listQrCodes } from "@/lib/data/qr-list";
import { listGuideSections } from "@/lib/data/guide";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { QrCardItem } from "@/components/qr/qr-card";
import { QrDownloadAll } from "@/components/qr/qr-download-all";
import { GenerateSectionQrDialog } from "@/components/qr/generate-section-qr-dialog";

const GROUP_LABELS: Record<string, string> = {
  apartment: "Apartment",
  room: "Rooms",
  room_item: "Room items",
  guide_section: "Guest guide sections",
};

export default async function QrCodesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user } = await requireUser();
  const apartment = await getOwnedApartment(supabase, slug, user.id);
  if (!apartment) notFound();

  const [codes, sections] = await Promise.all([
    listQrCodes(supabase, apartment.id),
    listGuideSections(supabase, apartment.id),
  ]);

  const linkedSectionIds = new Set(
    codes.filter((c) => c.target_type === "guide_section").map((c) => c.target_id)
  );
  const availableSections = sections.filter((s) => !linkedSectionIds.has(s.id));

  const groups = codes.reduce<Record<string, typeof codes>>((acc, code) => {
    (acc[code.target_type] ??= []).push(code);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="QR Code Center"
        description="Branded, scannable codes for your apartment, rooms and appliances."
        actions={
          <>
            <GenerateSectionQrDialog apartmentId={apartment.id} slug={slug} sections={availableSections} />
            <QrDownloadAll apartmentName={apartment.name} codes={codes} />
          </>
        }
      />

      {codes.length === 0 ? (
        <EmptyState
          icon={QrCode}
          title="No QR codes yet"
          description="QR codes are created automatically when you add rooms and items — or generate one for a guest guide section."
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groups).map(([type, items]) => (
            <div key={type}>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">{GROUP_LABELS[type] ?? type}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((qr) => (
                  <QrCardItem key={qr.id} qr={qr} logoUrl={apartment.logo_url} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
