import "server-only";

import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth";

export async function getCompanyContext() {
  const ctx = await requireRole("office_manager");
  const { supabase, profile } = ctx;

  if (!profile.company_id) redirect("/company/login");

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", profile.company_id)
    .single();

  if (!company) redirect("/company/login");

  return { ...ctx, company };
}
