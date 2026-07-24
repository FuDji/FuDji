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
  apartment: "Apartman",
  room: "Sobe",
  room_item: "Stavke u sobama",
  guide_section: "Sekcije vodiča za goste",
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
        title="Centar za QR kodove"
        description="Brendirani kodovi za skeniranje — za apartman, sobe i uređaje."
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
          title="Još nema QR kodova"
          description="QR kodovi se automatski kreiraju kada dodaš sobe i stavke — ili generiši jedan za sekciju vodiča za goste."
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
