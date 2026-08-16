import "server-only";

import { redirect } from "next/navigation";

import { createClient, type PortalScope } from "@/lib/supabase/server";
import { ROLE_HOME } from "@/lib/constants";
import type { Profile, UserRole } from "@/types";

/** Which cookie-isolated portal a given role's session lives under. */
export const ROLE_SCOPE: Record<UserRole, PortalScope> = {
  employee: "app",
  office_manager: "company",
  restaurant_staff: "restaurant",
  admin: "admin",
};

function loginPath(scope?: PortalScope) {
  return scope ? `/${scope}/login` : "/login";
}

export async function requireUser(scope?: PortalScope) {
  const supabase = await createClient(scope);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(loginPath(scope));

  return { supabase, user };
}

/** Loads the current user's profile row, redirecting to that portal's login if unauthenticated. */
export async function requireProfile(scope?: PortalScope) {
  const { supabase, user } = await requireUser(scope);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) redirect(loginPath(scope));

  if (!profile.active) {
    await supabase.auth.signOut();
    redirect(`${loginPath(scope)}?error=account_deactivated`);
  }

  return { supabase, user, profile };
}

/** Loads the current user's profile and enforces it matches one of `roles`, else redirects home. */
export async function requireRole(roles: UserRole | UserRole[]) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  const scope = ROLE_SCOPE[allowed[0]];
  const { supabase, user, profile } = await requireProfile(scope);

  if (!allowed.includes(profile.role)) {
    redirect(ROLE_HOME[profile.role] ?? "/login");
  }

  return { supabase, user, profile };
}
