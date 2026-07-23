"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { apartmentSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export type FormState = { error?: string } | undefined;

function parseApartmentForm(formData: FormData) {
  return apartmentSchema.safeParse({
    name: formData.get("name"),
    logo_url: formData.get("logo_url"),
    hero_image_url: formData.get("hero_image_url"),
    address: formData.get("address"),
    country: formData.get("country"),
    city: formData.get("city"),
    lat: formData.get("lat") || undefined,
    lng: formData.get("lng") || undefined,
    phone: formData.get("phone"),
    email: formData.get("email"),
    check_in_time: formData.get("check_in_time"),
    check_out_time: formData.get("check_out_time"),
    wifi_name: formData.get("wifi_name"),
    wifi_password: formData.get("wifi_password"),
    parking_info: formData.get("parking_info"),
    description: formData.get("description"),
  });
}

async function uniqueSlug(supabase: Awaited<ReturnType<typeof requireUser>>["supabase"], base: string) {
  const baseSlug = slugify(base) || "apartment";
  let candidate = baseSlug;
  let attempt = 0;
  while (attempt < 25) {
    const { data } = await supabase.from("apartments").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    attempt += 1;
    candidate = `${baseSlug}-${attempt + 1}`;
  }
  return `${baseSlug}-${Date.now()}`;
}

export async function createApartment(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseApartmentForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { supabase, user } = await requireUser();
  const slug = await uniqueSlug(supabase, parsed.data.name);

  const { data, error } = await supabase
    .from("apartments")
    .insert({
      owner_id: user.id,
      slug,
      name: parsed.data.name,
      logo_url: parsed.data.logo_url || null,
      hero_image_url: parsed.data.hero_image_url || null,
      address: parsed.data.address || null,
      country: parsed.data.country || null,
      city: parsed.data.city || null,
      lat: parsed.data.lat ?? null,
      lng: parsed.data.lng ?? null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      check_in_time: parsed.data.check_in_time || "15:00",
      check_out_time: parsed.data.check_out_time || "11:00",
      wifi_name: parsed.data.wifi_name || null,
      wifi_password: parsed.data.wifi_password || null,
      parking_info: parsed.data.parking_info || null,
      description: parsed.data.description || null,
    })
    .select("slug")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/apartments");
  revalidatePath("/dashboard");
  redirect(`/apartments/${data.slug}/overview`);
}

export async function updateApartment(
  apartmentId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseApartmentForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("apartments")
    .update({
      name: parsed.data.name,
      logo_url: parsed.data.logo_url || null,
      hero_image_url: parsed.data.hero_image_url || null,
      address: parsed.data.address || null,
      country: parsed.data.country || null,
      city: parsed.data.city || null,
      lat: parsed.data.lat ?? null,
      lng: parsed.data.lng ?? null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      check_in_time: parsed.data.check_in_time || "15:00",
      check_out_time: parsed.data.check_out_time || "11:00",
      wifi_name: parsed.data.wifi_name || null,
      wifi_password: parsed.data.wifi_password || null,
      parking_info: parsed.data.parking_info || null,
      description: parsed.data.description || null,
    })
    .eq("id", apartmentId)
    .select("slug")
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/apartments/${data.slug}`);
  return undefined;
}

export async function deleteApartment(apartmentId: string) {
  const { supabase } = await requireUser();
  await supabase.from("apartments").delete().eq("id", apartmentId);
  revalidatePath("/apartments");
  redirect("/apartments");
}

export async function addEmergencyContact(apartmentId: string, label: string, phone: string) {
  const { supabase } = await requireUser();
  await supabase.from("emergency_contacts").insert({ apartment_id: apartmentId, label, phone });
  revalidatePath(`/apartments`);
}

export async function removeEmergencyContact(contactId: string) {
  const { supabase } = await requireUser();
  await supabase.from("emergency_contacts").delete().eq("id", contactId);
  revalidatePath(`/apartments`);
}

export async function addGalleryImage(apartmentId: string, url: string) {
  const { supabase } = await requireUser();
  await supabase.from("apartment_gallery").insert({ apartment_id: apartmentId, url });
  revalidatePath(`/apartments`);
}

export async function removeGalleryImage(imageId: string) {
  const { supabase } = await requireUser();
  await supabase.from("apartment_gallery").delete().eq("id", imageId);
  revalidatePath(`/apartments`);
}
