import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export interface ActivityItem {
  id: string;
  type: "maintenance" | "inventory" | "qr_scan" | "guide_view";
  title: string;
  apartmentName: string;
  createdAt: string;
}

export interface DashboardStats {
  totalApartments: number;
  openMaintenance: number;
  inventoryAlerts: number;
  totalQrCodes: number;
  guideViews7d: number;
  scanTrend: { date: string; scans: number; views: number }[];
  recentActivity: ActivityItem[];
}

export async function getDashboardStats(supabase: Client, ownerId: string): Promise<DashboardStats> {
  const { data: apartments } = await supabase
    .from("apartments")
    .select("id, name")
    .eq("owner_id", ownerId);

  const apartmentIds = (apartments ?? []).map((a) => a.id);
  const nameById = new Map((apartments ?? []).map((a) => [a.id, a.name]));

  if (apartmentIds.length === 0) {
    return {
      totalApartments: 0,
      openMaintenance: 0,
      inventoryAlerts: 0,
      totalQrCodes: 0,
      guideViews7d: 0,
      scanTrend: emptyTrend(),
      recentActivity: [],
    };
  }

  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [maintenance, inventory, qrCodeRows, guideViews, recentMaintenance] = await Promise.all([
    supabase
      .from("maintenance_issues")
      .select("id", { count: "exact", head: true })
      .in("apartment_id", apartmentIds)
      .in("status", ["open", "in_progress"]),
    supabase
      .from("inventory_items")
      .select("id", { count: "exact", head: true })
      .in("apartment_id", apartmentIds)
      .neq("status", "ok"),
    supabase.from("qr_codes").select("id").in("apartment_id", apartmentIds),
    supabase
      .from("guide_views")
      .select("apartment_id, viewed_at")
      .in("apartment_id", apartmentIds)
      .gte("viewed_at", fourteenDaysAgo),
    supabase
      .from("maintenance_issues")
      .select("id, title, apartment_id, created_at")
      .in("apartment_id", apartmentIds)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const qrCodeIds = (qrCodeRows.data ?? []).map((q) => q.id);
  const qrScans =
    qrCodeIds.length > 0
      ? await supabase
          .from("qr_scans")
          .select("scanned_at")
          .in("qr_code_id", qrCodeIds)
          .gte("scanned_at", fourteenDaysAgo)
      : { data: [] as { scanned_at: string }[] };

  const scanTrend = buildTrend(
    (guideViews.data ?? []).map((v) => v.viewed_at),
    (qrScans.data ?? []).map((s) => s.scanned_at)
  );

  const guideViews7d = (guideViews.data ?? []).filter(
    (v) => new Date(v.viewed_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  ).length;

  const recentActivity: ActivityItem[] = (recentMaintenance.data ?? []).map((m) => ({
    id: m.id,
    type: "maintenance",
    title: m.title,
    apartmentName: nameById.get(m.apartment_id) ?? "Apartment",
    createdAt: m.created_at,
  }));

  return {
    totalApartments: apartmentIds.length,
    openMaintenance: maintenance.count ?? 0,
    inventoryAlerts: inventory.count ?? 0,
    totalQrCodes: qrCodeIds.length,
    guideViews7d,
    scanTrend,
    recentActivity,
  };
}

function emptyTrend() {
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
    return { date: d.toLocaleDateString("en-US", { weekday: "short" }), scans: 0, views: 0 };
  });
}

function buildTrend(viewTimestamps: string[], scanTimestamps: string[]) {
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
    return { key: d.toDateString(), date: d.toLocaleDateString("en-US", { weekday: "short" }), scans: 0, views: 0 };
  });
  const byKey = new Map(days.map((d) => [d.key, d]));

  for (const ts of viewTimestamps) {
    const key = new Date(ts).toDateString();
    const bucket = byKey.get(key);
    if (bucket) bucket.views += 1;
  }
  for (const ts of scanTimestamps) {
    const key = new Date(ts).toDateString();
    const bucket = byKey.get(key);
    if (bucket) bucket.scans += 1;
  }

  return days.map(({ date, scans, views }) => ({ date, scans, views }));
}
