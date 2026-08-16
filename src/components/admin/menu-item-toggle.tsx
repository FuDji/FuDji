"use client";

import { useTransition } from "react";

import { toggleMenuItemActiveAdmin } from "@/app/admin/actions";
import { Switch } from "@/components/ui/switch";

export function AdminMenuItemToggle({ itemId, active }: { itemId: string; active: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <Switch
      checked={active}
      disabled={pending}
      onCheckedChange={(checked) =>
        startTransition(async () => {
          await toggleMenuItemActiveAdmin(itemId, checked);
        })
      }
    />
  );
}
