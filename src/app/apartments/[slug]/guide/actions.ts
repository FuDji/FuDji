"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import type { GuideBlock } from "@/types/database";

export async function createGuideSection(
  apartmentId: string,
  slug: string,
  input: { key: string; title: string; icon: string }
) {
  const { supabase } = await requireUser();

  const { count } = await supabase
    .from("guide_sections")
    .select("id", { count: "exact", head: true })
    .eq("apartment_id", apartmentId);

  let key = input.key;
  const { data: existing } = await supabase
    .from("guide_sections")
    .select("id")
    .eq("apartment_id", apartmentId)
    .eq("key", key)
    .maybeSingle();
  if (existing) key = `${key}-${Date.now()}`;

  const { data, error } = await supabase
    .from("guide_sections")
    .insert({
      apartment_id: apartmentId,
      key,
      title: input.title,
      icon: input.icon,
      position: count ?? 0,
      blocks: [],
    })
    .select("id")
    .single();

  if (error) throw error;

  revalidatePath(`/apartments/${slug}/guide`);
  return data.id as string;
}

export async function updateGuideSectionMeta(
  sectionId: string,
  slug: string,
  input: { title: string; icon: string; published: boolean }
) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("guide_sections").update(input).eq("id", sectionId);
  if (error) throw error;
  revalidatePath(`/apartments/${slug}/guide`);
}

export async function updateGuideSectionBlocks(sectionId: string, slug: string, blocks: GuideBlock[]) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("guide_sections").update({ blocks }).eq("id", sectionId);
  if (error) throw error;
  revalidatePath(`/apartments/${slug}/guide`);
  revalidatePath(`/g/${slug}`);
}

export async function deleteGuideSection(sectionId: string, slug: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("guide_sections").delete().eq("id", sectionId);
  if (error) throw error;
  revalidatePath(`/apartments/${slug}/guide`);
}

export async function reorderGuideSections(slug: string, orderedIds: string[]) {
  const { supabase } = await requireUser();
  await Promise.all(
    orderedIds.map((id, index) => supabase.from("guide_sections").update({ position: index }).eq("id", id))
  );
  revalidatePath(`/apartments/${slug}/guide`);
}
