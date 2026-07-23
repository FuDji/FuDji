import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function listRooms(supabase: Client, apartmentId: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("apartment_id", apartmentId)
    .order("position", { ascending: true });

  if (error) throw error;

  const rooms = data ?? [];
  if (rooms.length === 0) return [] as (typeof rooms[number] & { itemCount: number })[];

  const { data: items } = await supabase
    .from("room_items")
    .select("room_id")
    .in(
      "room_id",
      rooms.map((r) => r.id)
    );

  const counts = new Map<string, number>();
  for (const item of items ?? []) {
    counts.set(item.room_id, (counts.get(item.room_id) ?? 0) + 1);
  }

  return rooms.map((room) => ({ ...room, itemCount: counts.get(room.id) ?? 0 }));
}

export async function getRoom(supabase: Client, roomId: string) {
  const { data, error } = await supabase.from("rooms").select("*").eq("id", roomId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listRoomItems(supabase: Client, roomId: string) {
  const { data, error } = await supabase
    .from("room_items")
    .select("*")
    .eq("room_id", roomId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}
