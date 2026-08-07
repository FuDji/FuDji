"use client";

import { useState } from "react";
import { Check, Copy, X } from "lucide-react";

import { revokeInvitation, toggleProfileActive } from "@/app/admin/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusToggle } from "@/components/admin/status-toggle";

type Manager = { id: string; full_name: string | null; email: string | null };
type Invite = { id: string; email: string; full_name: string | null; token: string };

function InviteRow({ invite }: { invite: Invite }) {
  const [copied, setCopied] = useState(false);
  const link = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`;

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-3 py-3">
        <div className="min-w-32">
          <div className="font-medium">{invite.full_name}</div>
          <div className="text-xs text-muted-foreground">{invite.email}</div>
        </div>
        <Badge variant="warning">Pozivnica na čekanju</Badge>
        <Input readOnly value={link} className="h-8 min-w-0 flex-1 text-xs" />
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          onClick={() => revokeInvitation(invite.id)}
        >
          <X className="size-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function ManagerSection({ managers, invites }: { managers: Manager[]; invites: Invite[] }) {
  if (managers.length === 0 && invites.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      {managers.map((manager) => (
        <Card key={manager.id}>
          <CardContent className="flex flex-wrap items-center gap-3 py-3">
            <div className="min-w-32 flex-1">
              <div className="font-medium">{manager.full_name}</div>
              <div className="text-xs text-muted-foreground">{manager.email}</div>
            </div>
            <span className="text-xs text-muted-foreground">Ukloni pristup</span>
            <StatusToggle active={true} onToggle={toggleProfileActive.bind(null, manager.id)} />
          </CardContent>
        </Card>
      ))}
      {invites.map((inv) => (
        <InviteRow key={inv.id} invite={inv} />
      ))}
    </div>
  );
}
