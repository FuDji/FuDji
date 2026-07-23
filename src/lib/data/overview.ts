import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getApartmentOverview(supabase: Client, apartmentId: string) {
  const [rooms, guideSections, inventoryAlerts, openMaintenance, latestMaintenance, topQrCodes, topGuides] =
    await Promise.all([
      supabase.from("rooms").select("id", { count: "exact", head: true }).eq("apartment_id", apartmentId),
      supabase
        .from("guide_sections")
        .select("id", { count: "exact", head: true })
        .eq("apartment_id", apartmentId),
      supabase
        .from("inventory_items")
        .select("id", { count: "exact", head: true })
        .eq("apartment_id", apartmentId)
        .neq("status", "ok"),
      supabase
        .from("maintenance_issues")
        .select("id", { count: "exact", head: true })
        .eq("apartment_id", apartmentId)
        .in("status", ["open", "in_progress"]),
      supabase
        .from("maintenance_issues")
        .select("*")
        .eq("apartment_id", apartmentId)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("qr_codes")
        .select("*")
        .eq("apartment_id", apartmentId)
        .order("scan_count", { ascending: false })
        .limit(5),
      supabase
        .from("guide_sections")
        .select("*")
        .eq("apartment_id", apartmentId)
        .order("view_count", { ascending: false })
        .limit(5),
    ]);

  return {
    roomCount: rooms.count ?? 0,
    guideSectionCount: guideSections.count ?? 0,
    inventoryAlertCount: inventoryAlerts.count ?? 0,
    openMaintenanceCount: openMaintenance.count ?? 0,
    latestMaintenance: latestMaintenance.data ?? [],
    topQrCodes: topQrCodes.data ?? [],
    topGuides: topGuides.data ?? [],
  };
}
