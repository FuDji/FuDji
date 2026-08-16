"use client";

import { useTransition } from "react";

import { toggleMenuItemActive } from "@/app/restaurant/actions";
import { Switch } from "@/components/ui/switch";

export function MenuItemToggle({ itemId, active }: { itemId: string; active: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <Switch
      checked={active}
      disabled={pending}
      onCheckedChange={(checked) =>
        startTransition(async () => {
          await toggleMenuItemActive(itemId, checked);
        })
      }
    />
  );
}
