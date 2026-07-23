import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getOwnedApartment } from "@/lib/data/apartments";
import { getMaintenanceIssue, listMaintenanceEvents } from "@/lib/data/maintenance";
import { IssueDetail } from "@/components/maintenance/issue-detail";

export default async function MaintenanceIssuePage({
  params,
}: {
  params: Promise<{ slug: string; issueId: string }>;
}) {
  const { slug, issueId } = await params;
  const { supabase, user } = await requireUser();
  const apartment = await getOwnedApartment(supabase, slug, user.id);
  if (!apartment) notFound();

  const issue = await getMaintenanceIssue(supabase, issueId);
  if (!issue || issue.apartment_id !== apartment.id) notFound();

  const events = await listMaintenanceEvents(supabase, issueId);

  return <IssueDetail slug={slug} issue={issue} events={events} />;
}
