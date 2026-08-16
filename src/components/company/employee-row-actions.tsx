"use client";

import { useTransition } from "react";

import { toggleEmployeeActive } from "@/app/company/actions";
import { Switch } from "@/components/ui/switch";

export function ActiveToggle({ employeeId, active }: { employeeId: string; active: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <Switch
      checked={active}
      disabled={pending}
      onCheckedChange={(checked) =>
        startTransition(async () => {
          await toggleEmployeeActive(employeeId, checked);
        })
      }
    />
  );
}
