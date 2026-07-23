"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { createQrCode, deleteQrCodesForTarget, renameQrCodesForTarget } from "@/lib/data/qr";
import type { FaqEntry } from "@/types/database";

export async function createRoom(
  apartmentId: string,
  slug: string,
  input: { name: string; icon: string; cover_image_url?: string }
) {
  const { supabase } = await requireUser();

  const { count } = await supabase
    .from("rooms")
    .select("id", { count: "exact", head: true })
    .eq("apartment_id", apartmentId);

  const { data, error } = await supabase
    .from("rooms")
    .insert({
      apartment_id: apartmentId,
      name: input.name,
      icon: input.icon,
      cover_image_url: input.cover_image_url || null,
      position: count ?? 0,
    })
    .select("id")
    .single();

  if (error) throw error;

  await createQrCode(supabase, {
    apartmentId,
    targetType: "room",
    targetId: data.id,
    label: `${input.name} QR`,
  });

  revalidatePath(`/apartments/${slug}/rooms`);
  return data.id as string;
}

export async function updateRoom(
  roomId: string,
  slug: string,
  input: { name: string; icon: string; cover_image_url?: string }
) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("rooms")
    .update({ name: input.name, icon: input.icon, cover_image_url: input.cover_image_url || null })
    .eq("id", roomId);
  if (error) throw error;

  await renameQrCodesForTarget(supabase, "room", roomId, `${input.name} QR`);

  revalidatePath(`/apartments/${slug}/rooms`);
}

export async function deleteRoom(roomId: string, slug: string) {
  const { supabase } = await requireUser();
  await deleteQrCodesForTarget(supabase, "room", roomId);
  const { error } = await supabase.from("rooms").delete().eq("id", roomId);
  if (error) throw error;
  revalidatePath(`/apartments/${slug}/rooms`);
}

export async function createRoomItem(
  apartmentId: string,
  roomId: string,
  slug: string,
  input: {
    name: string;
    icon: string;
    instructions?: string;
    video_url?: string;
    warnings?: string;
    tips?: string;
    images?: string[];
    faqs?: FaqEntry[];
  }
) {
  const { supabase } = await requireUser();

  const { count } = await supabase
    .from("room_items")
    .select("id", { count: "exact", head: true })
    .eq("room_id", roomId);

  const { data, error } = await supabase
    .from("room_items")
    .insert({
      room_id: roomId,
      name: input.name,
      icon: input.icon,
      instructions: input.instructions || null,
      video_url: input.video_url || null,
      warnings: input.warnings || null,
      tips: input.tips || null,
      images: input.images ?? [],
      faqs: input.faqs ?? [],
      position: count ?? 0,
    })
    .select("id")
    .single();

  if (error) throw error;

  await createQrCode(supabase, {
    apartmentId,
    targetType: "room_item",
    targetId: data.id,
    label: `${input.name} QR`,
  });

  revalidatePath(`/apartments/${slug}/rooms/${roomId}`);
}

export async function updateRoomItem(
  itemId: string,
  roomId: string,
  slug: string,
  input: {
    name: string;
    icon: string;
    instructions?: string;
    video_url?: string;
    warnings?: string;
    tips?: string;
    images?: string[];
    faqs?: FaqEntry[];
  }
) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("room_items")
    .update({
      name: input.name,
      icon: input.icon,
      instructions: input.instructions || null,
      video_url: input.video_url || null,
      warnings: input.warnings || null,
      tips: input.tips || null,
      images: input.images ?? [],
      faqs: input.faqs ?? [],
    })
    .eq("id", itemId);
  if (error) throw error;

  await renameQrCodesForTarget(supabase, "room_item", itemId, `${input.name} QR`);

  revalidatePath(`/apartments/${slug}/rooms/${roomId}`);
}

export async function deleteRoomItem(itemId: string, roomId: string, slug: string) {
  const { supabase } = await requireUser();
  await deleteQrCodesForTarget(supabase, "room_item", itemId);
  const { error } = await supabase.from("room_items").delete().eq("id", itemId);
  if (error) throw error;
  revalidatePath(`/apartments/${slug}/rooms/${roomId}`);
}
