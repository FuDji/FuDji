"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { createQrCode } from "@/lib/data/qr";

export async function generateSectionQr(
  apartmentId: string,
  slug: string,
  sectionId: string,
  label: string
) {
  const { supabase } = await requireUser();
  await createQrCode(supabase, {
    apartmentId,
    targetType: "guide_section",
    targetId: sectionId,
    label: `${label} QR`,
  });
  revalidatePath(`/apartments/${slug}/qr-codes`);
}
