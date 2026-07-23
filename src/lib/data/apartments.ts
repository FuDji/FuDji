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
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const [gallery, contacts] = await Promise.all([
    supabase.from("apartment_gallery").select("*").eq("apartment_id", data.id).order("position", { ascending: true }),
    supabase.from("emergency_contacts").select("*").eq("apartment_id", data.id).order("position", { ascending: true }),
  ]);

  return { ...data, apartment_gallery: gallery.data ?? [], emergency_contacts: contacts.data ?? [] };
}

export async function listEmergencyContacts(supabase: Client, apartmentId: string) {
  const { data, error } = await supabase
    .from("emergency_contacts")
    .select("*")
    .eq("apartment_id", apartmentId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function listGalleryImages(supabase: Client, apartmentId: string) {
  const { data, error } = await supabase
    .from("apartment_gallery")
    .select("*")
    .eq("apartment_id", apartmentId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getNotificationPreferences(supabase: Client, apartmentId: string) {
  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("apartment_id", apartmentId)
    .maybeSingle();

  if (error) throw error;
  return (
    data ?? {
      apartment_id: apartmentId,
      email_maintenance: true,
      email_inventory: true,
      email_guest_activity: false,
      email_weekly_report: true,
    }
  );
}

export async function countOwnerApartments(supabase: Client, ownerId: string) {
  const { count, error } = await supabase
    .from("apartments")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", ownerId);

  if (error) throw error;
  return count ?? 0;
}
