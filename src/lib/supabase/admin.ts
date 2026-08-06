import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/**
 * Service-role client — bypasses RLS. Only ever import this from server
 * actions / route handlers, and only for the specific privileged operations
 * that can't be expressed as a normal user performing an action on their own
 * row (accepting an invite, sending invites that create auth users, etc).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase admin client is not configured: NEXT_PUBLIC_SUPABASE_URL / " +
        "SUPABASE_SERVICE_ROLE_KEY are missing from this deployment's environment."
    );
  }

  return createSupabaseClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
