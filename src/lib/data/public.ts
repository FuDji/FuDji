import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getPublicGuideSections(supabase: Client, apartmentId: string) {
  const { data, error } = await supabase
    .from("guide_sections")
    .select("*")
    .eq("apartment_id", apartmentId)
    .eq("published", true)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPublicRooms(supabase: Client, apartmentId: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("apartment_id", apartmentId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPublicRoom(supabase: Client, roomId: string) {
  const { data, error } = await supabase.from("rooms").select("*").eq("id", roomId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPublicRoomItems(supabase: Client, roomId: string) {
  const { data, error } = await supabase
    .from("room_items")
    .select("*")
    .eq("room_id", roomId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function logGuideView(supabase: Client, apartmentId: string, sectionId: string | null) {
  await supabase.from("guide_views").insert({ apartment_id: apartmentId, section_id: sectionId });
}
