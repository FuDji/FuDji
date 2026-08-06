"use client";

import { useTransition } from "react";
import { X } from "lucide-react";

import { revokeInvitation } from "@/app/company/actions";
import { Button } from "@/components/ui/button";

export function RevokeInviteButton({ invitationId }: { invitationId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="icon-sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await revokeInvitation(invitationId);
        })
      }
    >
      <X className="size-3.5" />
    </Button>
  );
}
