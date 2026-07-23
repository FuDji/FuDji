import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function listQrCodes(supabase: Client, apartmentId: string) {
  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("apartment_id", apartmentId)
    .order("target_type", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
