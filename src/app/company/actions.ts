"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { inviteEmployeeSchema, companySchema } from "@/lib/validations";

export type ActionState = { error?: string; success?: boolean; inviteLink?: string } | undefined;

export async function inviteEmployee(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, user, profile } = await requireRole("office_manager");
  if (!profile.company_id) return { error: "Nalog nije povezan ni sa jednom firmom." };

  const parsed = inviteEmployeeSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    daily_budget_override: formData.get("daily_budget_override") || null,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Neispravan unos" };

  const { data, error } = await supabase
    .from("invitations")
    .insert({
      company_id: profile.company_id,
      email: parsed.data.email,
      full_name: parsed.data.full_name,
      role: "employee",
      daily_budget_override: parsed.data.daily_budget_override,
      invited_by: user.id,
    })
    .select("token")
    .single();

  if (error || !data) return { error: "Pozivnica nije mogla biti kreirana." };

  revalidatePath("/company/employees");
  return { success: true, inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${data.token}` };
}

export async function bulkInviteEmployees(
  rows: { full_name: string; email: string; daily_budget_override: number | null }[]
): Promise<{ error?: string; created?: number }> {
  const { supabase, user, profile } = await requireRole("office_manager");
  if (!profile.company_id) return { error: "Nalog nije povezan ni sa jednom firmom." };
  if (rows.length === 0) return { error: "Fajl ne sadrži nijedan red sa email adresom." };

  const { error } = await supabase.from("invitations").insert(
    rows.map((r) => ({
      company_id: profile.company_id,
      email: r.email,
      full_name: r.full_name,
      role: "employee" as const,
      daily_budget_override: r.daily_budget_override,
      invited_by: user.id,
    }))
  );

  if (error) return { error: "Pozivnice nisu mogle biti kreirane." };

  revalidatePath("/company/employees");
  return { created: rows.length };
}

export async function updateEmployeeBudget(
  employeeId: string,
  budgetOverride: number | null
): Promise<ActionState> {
  const { supabase } = await requireRole("office_manager");

  const { error } = await supabase
    .from("profiles")
    .update({ daily_budget_override: budgetOverride })
    .eq("id", employeeId);

  if (error) return { error: "Budžet nije mogao biti sačuvan." };

  revalidatePath("/company/employees");
  return { success: true };
}

export async function toggleEmployeeActive(employeeId: string, active: boolean): Promise<ActionState> {
  const { supabase } = await requireRole("office_manager");

  const { error } = await supabase.from("profiles").update({ active }).eq("id", employeeId);
  if (error) return { error: "Status nije mogao biti sačuvan." };

  revalidatePath("/company/employees");
  return { success: true };
}

export async function updateCompanySettings(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase, profile } = await requireRole("office_manager");
  if (!profile.company_id) return { error: "Nalog nije povezan ni sa jednom firmom." };

  const parsed = companySchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    contact_phone: formData.get("contact_phone"),
    contact_email: formData.get("contact_email"),
    payment_type: formData.get("payment_type"),
    daily_budget: formData.get("daily_budget"),
    monthly_budget: formData.get("monthly_budget") || null,
    mixed_cap: formData.get("mixed_cap") || null,
    cutoff_time: formData.get("cutoff_time"),
    delivery_time: formData.get("delivery_time"),
    delivery_tolerance_minutes: formData.get("delivery_tolerance_minutes"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Neispravan unos" };

  const { error } = await supabase
    .from("companies")
    .update(parsed.data)
    .eq("id", profile.company_id);
  if (error) return { error: "Podešavanja nisu mogla biti sačuvana." };

  revalidatePath("/company/settings");
  return { success: true };
}

export async function revokeInvitation(invitationId: string): Promise<ActionState> {
  const { supabase } = await requireRole("office_manager");

  const { error } = await supabase
    .from("invitations")
    .update({ status: "revoked" })
    .eq("id", invitationId);
  if (error) return { error: "Pozivnica nije mogla biti opozvana." };

  revalidatePath("/company/employees");
  return { success: true };
}
