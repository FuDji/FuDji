import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getApartmentAnalytics(supabase: Client, apartmentId: string) {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [qrCodesRes, guideSectionsRes, roomsRes, resolvedIssuesRes, allIssuesRes, inventoryRes, inventoryReportsRes] =
    await Promise.all([
      supabase.from("qr_codes").select("*").eq("apartment_id", apartmentId).order("scan_count", { ascending: false }),
      supabase
        .from("guide_sections")
        .select("*")
        .eq("apartment_id", apartmentId)
        .order("view_count", { ascending: false }),
      supabase.from("rooms").select("id, name").eq("apartment_id", apartmentId),
      supabase
        .from("maintenance_issues")
        .select("created_at, resolved_at")
        .eq("apartment_id", apartmentId)
        .not("resolved_at", "is", null),
      supabase
        .from("maintenance_issues")
        .select("id, room_id, category, created_at")
        .eq("apartment_id", apartmentId)
        .gte("created_at", ninetyDaysAgo),
      supabase
        .from("inventory_items")
        .select("id, name, status")
        .eq("apartment_id", apartmentId)
        .neq("status", "ok"),
      supabase
        .from("inventory_reports")
        .select("id, type, created_at, item_id")
        .gte("created_at", thirtyDaysAgo),
    ]);

  const qrCodes = qrCodesRes.data ?? [];
  const guideSections = guideSectionsRes.data ?? [];
  const rooms = new Map((roomsRes.data ?? []).map((r) => [r.id, r.name]));
  const resolvedIssues = resolvedIssuesRes.data ?? [];
  const allIssues = allIssuesRes.data ?? [];
  const inventoryAlerts = inventoryRes.data ?? [];

  const totalScans = qrCodes.reduce((sum, q) => sum + q.scan_count, 0);
  const totalViews = guideSections.reduce((sum, g) => sum + g.view_count, 0);

  const avgRepairMs =
    resolvedIssues.length > 0
      ? resolvedIssues.reduce(
          (sum, i) => sum + (new Date(i.resolved_at!).getTime() - new Date(i.created_at).getTime()),
          0
        ) / resolvedIssues.length
      : 0;
  const avgRepairHours = Math.round(avgRepairMs / 1000 / 60 / 60);

  const roomIssueCounts = new Map<string, number>();
  for (const issue of allIssues) {
    if (!issue.room_id) continue;
    roomIssueCounts.set(issue.room_id, (roomIssueCounts.get(issue.room_id) ?? 0) + 1);
  }
  let mostProblematicRoom: { name: string; count: number } | null = null;
  for (const [roomId, count] of roomIssueCounts) {
    if (!mostProblematicRoom || count > mostProblematicRoom.count) {
      mostProblematicRoom = { name: rooms.get(roomId) ?? "Soba", count };
    }
  }

  const monthlyBuckets = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("sr-Latn-RS", { month: "short" }), count: 0 };
  });
  const bucketByKey = new Map(monthlyBuckets.map((b) => [b.key, b]));
  for (const issue of allIssues) {
    const d = new Date(issue.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = bucketByKey.get(key);
    if (bucket) bucket.count += 1;
  }

  const heatmap = Array.from({ length: 7 }, () => Array(24).fill(0) as number[]);
  const scanTimestamps: string[] = [];
  const { data: qrIdsData } = await supabase.from("qr_codes").select("id").eq("apartment_id", apartmentId);
  const qrIds = (qrIdsData ?? []).map((q) => q.id);
  if (qrIds.length > 0) {
    const { data: scans } = await supabase
      .from("qr_scans")
      .select("scanned_at")
      .in("qr_code_id", qrIds)
      .gte("scanned_at", thirtyDaysAgo);
    for (const scan of scans ?? []) {
      const d = new Date(scan.scanned_at);
      heatmap[d.getDay()][d.getHours()] += 1;
      scanTimestamps.push(scan.scanned_at);
    }
  }

  const categoryBreakdown = new Map<string, number>();
  for (const issue of allIssues) {
    categoryBreakdown.set(issue.category, (categoryBreakdown.get(issue.category) ?? 0) + 1);
  }

  return {
    totalScans,
    totalViews,
    avgRepairHours,
    mostProblematicRoom,
    topQrCodes: qrCodes.slice(0, 6),
    topGuides: guideSections.slice(0, 6),
    monthlyMaintenance: monthlyBuckets,
    heatmap,
    inventoryAlerts,
    inventoryReports30d: inventoryReportsRes.data ?? [],
    categoryBreakdown: Array.from(categoryBreakdown.entries()).map(([category, count]) => ({ category, count })),
  };
}
