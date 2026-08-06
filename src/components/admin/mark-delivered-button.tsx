"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";

import { markCompanyDelivered } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function MarkDeliveredButton({
  companyId,
  date,
  scheduledAt,
}: {
  companyId: string;
  date: string;
  scheduledAt: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await markCompanyDelivered(companyId, date, scheduledAt);
        })
      }
    >
      <Check className="size-3.5" /> Označi dostavljeno
    </Button>
  );
}
