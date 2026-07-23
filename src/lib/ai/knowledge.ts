import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import type { Apartment } from "@/types";

type Client = SupabaseClient<Database>;

export async function buildKnowledgeBase(supabase: Client, apartment: Apartment) {
  const [sectionsRes, roomsRes] = await Promise.all([
    supabase
      .from("guide_sections")
      .select("title, blocks")
      .eq("apartment_id", apartment.id)
      .eq("published", true),
    supabase.from("rooms").select("id, name").eq("apartment_id", apartment.id),
  ]);

  const rooms = roomsRes.data ?? [];
  let roomItemsText = "";
  if (rooms.length > 0) {
    const { data: items } = await supabase
      .from("room_items")
      .select("name, instructions, tips, warnings, faqs, room_id")
      .in(
        "room_id",
        rooms.map((r) => r.id)
      );
    const roomNameById = new Map(rooms.map((r) => [r.id, r.name]));
    roomItemsText = (items ?? [])
      .map((item) => {
        const parts = [`${roomNameById.get(item.room_id)} — ${item.name}`];
        if (item.instructions) parts.push(`Instructions: ${item.instructions}`);
        if (item.tips) parts.push(`Tips: ${item.tips}`);
        if (item.warnings) parts.push(`Warnings: ${item.warnings}`);
        for (const faq of item.faqs ?? []) parts.push(`Q: ${faq.question} A: ${faq.answer}`);
        return parts.join("\n");
      })
      .join("\n\n");
  }

  const sectionsText = (sectionsRes.data ?? [])
    .map((section) => {
      const text = section.blocks
        .filter((b) => b.type === "text")
        .map((b) => b.content)
        .filter(Boolean)
        .join(" ");
      return text ? `${section.title}: ${text}` : null;
    })
    .filter(Boolean)
    .join("\n\n");

  const basics = [
    `Apartment name: ${apartment.name}`,
    apartment.address ? `Address: ${apartment.address}, ${apartment.city ?? ""} ${apartment.country ?? ""}` : null,
    `Check-in time: ${apartment.check_in_time}`,
    `Check-out time: ${apartment.check_out_time}`,
    apartment.wifi_name ? `WiFi network: ${apartment.wifi_name}` : null,
    apartment.wifi_password ? `WiFi password: ${apartment.wifi_password}` : null,
    apartment.parking_info ? `Parking: ${apartment.parking_info}` : null,
    apartment.description ? `About: ${apartment.description}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const full = [basics, sectionsText, roomItemsText].filter(Boolean).join("\n\n");
  return full.slice(0, 12000);
}
