"use client";

import { useTransition } from "react";

import { Switch } from "@/components/ui/switch";

export function StatusToggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: (active: boolean) => Promise<unknown>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Switch
      checked={active}
      disabled={pending}
      onCheckedChange={(checked) => startTransition(async () => { await onToggle(checked); })}
    />
  );
}
