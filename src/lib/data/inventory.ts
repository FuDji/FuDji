import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function listInventoryItems(supabase: Client, apartmentId: string) {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("apartment_id", apartmentId)
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPublicInventoryItems(supabase: Client, apartmentId: string) {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("id, name, category, photo_url, location, status")
    .eq("apartment_id", apartmentId)
    .order("category", { ascending: true });

  if (error) throw error;
  return data;
}
