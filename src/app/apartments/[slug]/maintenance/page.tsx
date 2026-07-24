import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getOwnedApartment } from "@/lib/data/apartments";
import { listMaintenanceIssues } from "@/lib/data/maintenance";
import { listRooms } from "@/lib/data/rooms";
import { PageHeader } from "@/components/layout/page-header";
import { CreateIssueDialog } from "@/components/maintenance/create-issue-dialog";
import { IssueBoard } from "@/components/maintenance/issue-board";

export default async function MaintenancePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user } = await requireUser();
  const apartment = await getOwnedApartment(supabase, slug, user.id);
  if (!apartment) notFound();

  const [issues, rooms] = await Promise.all([
    listMaintenanceIssues(supabase, apartment.id),
    listRooms(supabase, apartment.id),
  ]);

  return (
    <div>
      <PageHeader
        title="Održavanje"
        description="Prati i reši probleme pre nego što ih gosti uopšte primete."
        actions={<CreateIssueDialog apartmentId={apartment.id} slug={slug} rooms={rooms} />}
      />
      <IssueBoard slug={slug} issues={issues} />
    </div>
  );
}
