import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function listApartments(supabase: Client, ownerId: string) {
  const { data, error } = await supabase
    .from("apartments")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getOwnedApartment(supabase: Client, slug: string, ownerId: string) {
  const { data, error } = await supabase
    .from("apartments")
    .select("*")
    .eq("slug", slug)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getPublicApartment(supabase: Client, slug: string) {
  const { data, error } = await supabase
    .from("apartments")
    .select("*, apartment_gallery(*), emergency_contacts(*)")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function countOwnerApartments(supabase: Client, ownerId: string) {
  const { count, error } = await supabase
    .from("apartments")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", ownerId);

  if (error) throw error;
  return count ?? 0;
}
