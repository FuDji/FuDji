"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";

import { updateEmployeeBudget } from "@/app/company/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BudgetCell({
  employeeId,
  value,
  placeholder,
}: {
  employeeId: string;
  value: number | null;
  placeholder: number;
}) {
  const [draft, setDraft] = useState(value != null ? String(value) : "");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(false);
    startTransition(async () => {
      const parsed = draft === "" ? null : Number(draft);
      await updateEmployeeBudget(employeeId, parsed);
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <Input
        type="number"
        value={draft}
        placeholder={String(placeholder)}
        onChange={(e) => setDraft(e.target.value)}
        className="h-8 w-28 text-xs"
      />
      <Button size="icon-sm" variant="outline" onClick={save} disabled={pending}>
        <Check className={saved ? "text-success" : ""} />
      </Button>
    </div>
  );
}
