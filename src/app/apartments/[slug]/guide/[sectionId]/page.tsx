import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getOwnedApartment } from "@/lib/data/apartments";
import { getGuideSection } from "@/lib/data/guide";
import { BlockEditor } from "@/components/guide/block-editor";

export default async function GuideSectionEditorPage({
  params,
}: {
  params: Promise<{ slug: string; sectionId: string }>;
}) {
  const { slug, sectionId } = await params;
  const { supabase, user } = await requireUser();
  const apartment = await getOwnedApartment(supabase, slug, user.id);
  if (!apartment) notFound();

  const section = await getGuideSection(supabase, sectionId);
  if (!section || section.apartment_id !== apartment.id) notFound();

  return <BlockEditor slug={slug} section={section} />;
}
