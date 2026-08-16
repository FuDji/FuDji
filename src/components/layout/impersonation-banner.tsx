import { cookies } from "next/headers";

import { StopImpersonatingButton } from "@/components/layout/stop-impersonating-button";
import { UserCog } from "lucide-react";
import type { PortalScope } from "@/lib/supabase/server";

export async function ImpersonationBanner({ scope }: { scope: PortalScope }) {
  const cookieStore = await cookies();
  const adminName = cookieStore.get(`pb_impersonate_${scope}`)?.value;
  if (!adminName) return null;

  return (
    <div className="sticky top-0 z-[60] flex items-center justify-center gap-3 bg-cta px-4 py-2 text-sm font-medium text-cta-foreground">
      <UserCog className="size-4" />
      <span>Ulogovan/a kao podrška ({adminName}) — pregledaš tuđi nalog radi debagovanja.</span>
      <StopImpersonatingButton scope={scope} />
    </div>
  );
}
