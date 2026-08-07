import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ROLE_HOME } from "@/lib/constants";
import type { Profile, UserRole } from "@/types";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return { supabase, user };
}

/** Loads the current user's profile row, redirecting to /login if unauthenticated. */
export async function requireProfile() {
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) redirect("/login");

  if (!profile.active) {
    await supabase.auth.signOut();
    redirect("/login?error=account_deactivated");
  }

  return { supabase, user, profile };
}

/** Loads the current user's profile and enforces it matches one of `roles`, else redirects home. */
export async function requireRole(roles: UserRole | UserRole[]) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  const { supabase, user, profile } = await requireProfile();

  if (!allowed.includes(profile.role)) {
    redirect(ROLE_HOME[profile.role] ?? "/login");
  }

  return { supabase, user, profile };
}
