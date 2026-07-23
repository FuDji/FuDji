import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import { slugify } from "@/lib/utils";

type Client = SupabaseClient<Database>;

export async function createQrCode(
  supabase: Client,
  input: {
    apartmentId: string;
    targetType: "apartment" | "guide_section" | "room" | "room_item";
    targetId: string;
    label: string;
  }
) {
  const base = slugify(`${input.targetType}-${input.label}`);
  let slug = base;
  let attempt = 0;
  while (attempt < 10) {
    const { data } = await supabase.from("qr_codes").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    attempt += 1;
    slug = `${base}-${attempt + 1}`;
  }

  const { error } = await supabase.from("qr_codes").insert({
    apartment_id: input.apartmentId,
    target_type: input.targetType,
    target_id: input.targetId,
    label: input.label,
    slug,
  });

  if (error) throw error;
}

export async function renameQrCodesForTarget(
  supabase: Client,
  targetType: "apartment" | "guide_section" | "room" | "room_item",
  targetId: string,
  label: string
) {
  await supabase.from("qr_codes").update({ label }).eq("target_type", targetType).eq("target_id", targetId);
}

export async function deleteQrCodesForTarget(
  supabase: Client,
  targetType: "apartment" | "guide_section" | "room" | "room_item",
  targetId: string
) {
  await supabase.from("qr_codes").delete().eq("target_type", targetType).eq("target_id", targetId);
}
