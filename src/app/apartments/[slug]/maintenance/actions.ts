"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { maintenanceIssueSchema } from "@/lib/validations";
import type { MaintenanceCategory, MaintenancePriority, MaintenanceStatus } from "@/types";

export type FormState = { error?: string } | undefined;

function parseIssueForm(formData: FormData) {
  return maintenanceIssueSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    priority: formData.get("priority"),
    room_id: formData.get("room_id"),
    assigned_to: formData.get("assigned_to"),
    due_date: formData.get("due_date"),
    photo_url: formData.get("photo_url"),
  });
}

export async function createMaintenanceIssue(
  apartmentId: string,
  slug: string,
  _prev: FormState,
  formData: FormData
) {
  const parsed = parseIssueForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("maintenance_issues")
    .insert({
      apartment_id: apartmentId,
      room_id: parsed.data.room_id || null,
      title: parsed.data.title,
      description: parsed.data.description || null,
      category: parsed.data.category as MaintenanceCategory,
      priority: parsed.data.priority as MaintenancePriority,
      assigned_to: parsed.data.assigned_to || null,
      due_date: parsed.data.due_date || null,
      photo_url: parsed.data.photo_url || null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await supabase.from("maintenance_events").insert({
    issue_id: data.id,
    type: "created",
    note: "Issue reported",
  });

  revalidatePath(`/apartments/${slug}/maintenance`);
  return {};
}

export async function updateMaintenanceStatus(issueId: string, slug: string, status: MaintenanceStatus) {
  const { supabase } = await requireUser();

  await supabase
    .from("maintenance_issues")
    .update({ status, resolved_at: status === "resolved" ? new Date().toISOString() : null })
    .eq("id", issueId);

  await supabase.from("maintenance_events").insert({
    issue_id: issueId,
    type: "status_change",
    note: `Status changed to ${status.replace("_", " ")}`,
  });

  revalidatePath(`/apartments/${slug}/maintenance`);
  revalidatePath(`/apartments/${slug}/maintenance/${issueId}`);
}

export async function addMaintenanceComment(issueId: string, slug: string, note: string) {
  if (!note.trim()) return;
  const { supabase } = await requireUser();
  await supabase.from("maintenance_events").insert({ issue_id: issueId, type: "comment", note });
  revalidatePath(`/apartments/${slug}/maintenance/${issueId}`);
}

export async function deleteMaintenanceIssue(issueId: string, slug: string) {
  const { supabase } = await requireUser();
  await supabase.from("maintenance_issues").delete().eq("id", issueId);
  revalidatePath(`/apartments/${slug}/maintenance`);
}
