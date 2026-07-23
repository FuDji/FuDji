import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function listMaintenanceIssues(supabase: Client, apartmentId: string) {
  const { data, error } = await supabase
    .from("maintenance_issues")
    .select("*")
    .eq("apartment_id", apartmentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getMaintenanceIssue(supabase: Client, issueId: string) {
  const { data, error } = await supabase.from("maintenance_issues").select("*").eq("id", issueId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listMaintenanceEvents(supabase: Client, issueId: string) {
  const { data, error } = await supabase
    .from("maintenance_events")
    .select("*")
    .eq("issue_id", issueId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}
