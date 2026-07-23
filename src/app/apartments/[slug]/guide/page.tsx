import { notFound } from "next/navigation";
import { BookOpenText } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getOwnedApartment } from "@/lib/data/apartments";
import { listGuideSections } from "@/lib/data/guide";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { AddSectionDialog } from "@/components/guide/add-section-dialog";
import { SectionList } from "@/components/guide/section-list";

export default async function GuestGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user } = await requireUser();
  const apartment = await getOwnedApartment(supabase, slug, user.id);
  if (!apartment) notFound();

  const sections = await listGuideSections(supabase, apartment.id);

  return (
    <div>
      <PageHeader
        title="Guest Guide"
        description="The digital handbook your guests see the moment they check in."
        actions={<AddSectionDialog apartmentId={apartment.id} slug={slug} />}
      />

      {sections.length === 0 ? (
        <EmptyState
          icon={BookOpenText}
          title="No sections yet"
          description="Start with Welcome, WiFi and House Rules — guests will see them at yourdomain.com/g/apartment-name"
          action={<AddSectionDialog apartmentId={apartment.id} slug={slug} />}
        />
      ) : (
        <SectionList slug={slug} sections={sections} />
      )}
    </div>
  );
}
