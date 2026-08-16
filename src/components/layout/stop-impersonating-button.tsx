"use client";

import { useTransition } from "react";

import { stopImpersonating } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import type { PortalScope } from "@/lib/supabase/server";

export function StopImpersonatingButton({ scope }: { scope: PortalScope }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      className="h-7"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await stopImpersonating(scope);
        })
      }
    >
      Nazad na admin nalog
    </Button>
  );
}
