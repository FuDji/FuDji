"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireProfile } from "@/lib/auth";
import type { PortalScope } from "@/lib/supabase/server";

export type ProfileActionState = { error?: string; success?: boolean } | undefined;

const PROFILE_PATH: Record<string, string> = {
  employee: "/app/profile",
  office_manager: "/company/profile",
  restaurant_staff: "/restaurant/profile",
  admin: "/admin/profile",
};

const profileSchema = z.object({
  phone: z
    .string()
    .max(30)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v.trim() : null)),
  avatar_url: z
    .string()
    .url("Unesi validan URL")
    .max(2000)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v.trim() : null)),
});

/** Self-service edit: only phone + avatar. Name/email/role/company/restaurant stay admin-only. */
export async function updateOwnProfile(
  scope: PortalScope,
  _prev: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const { supabase, profile } = await requireProfile(scope);

  const parsed = profileSchema.safeParse({
    phone: formData.get("phone"),
    avatar_url: formData.get("avatar_url"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Neispravan unos" };

  const { error } = await supabase
    .from("profiles")
    .update({
      phone: parsed.data.phone,
      avatar_url: parsed.data.avatar_url,
    })
    .eq("id", profile.id);
  if (error) return { error: "Podaci nisu mogli biti sačuvani." };

  revalidatePath(PROFILE_PATH[profile.role] ?? "/");
  return { success: true };
}
