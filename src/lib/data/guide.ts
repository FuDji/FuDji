import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function listGuideSections(supabase: Client, apartmentId: string) {
  const { data, error } = await supabase
    .from("guide_sections")
    .select("*")
    .eq("apartment_id", apartmentId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getGuideSection(supabase: Client, sectionId: string) {
  const { data, error } = await supabase.from("guide_sections").select("*").eq("id", sectionId).maybeSingle();
  if (error) throw error;
  return data;
}
