import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

/**
 * One cookie namespace per portal (via auth.storageKey) so being logged into
 * /restaurant in a tab doesn't kick out an /admin session in another tab of
 * the same browser — each portal keeps its own independent session.
 */
export type PortalScope = "app" | "company" | "restaurant" | "admin";

export async function createClient(scope?: PortalScope) {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "are missing from this deployment's environment. Set them in your hosting " +
        "provider's project settings and redeploy from a fresh build (not a cached redeploy)."
    );
  }

  return createServerClient<Database>(url, key, {
    // A path restriction is essential here, not just the name: without it
    // every portal's session cookie (all potentially chunked, since JWTs
    // don't fit in one 4KB cookie) rides along on every single request
    // regardless of which portal is being visited, and the combined
    // Cookie header can grow past what the browser/edge will forward —
    // manifesting as blank pages or redirect loops once someone has logged
    // into more than one portal in the same browser.
    cookieOptions: scope ? { name: `sb-primebite-${scope}`, path: `/${scope}` } : undefined,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // called from a Server Component — safe to ignore when middleware refreshes sessions
        }
      },
    },
  });
}
