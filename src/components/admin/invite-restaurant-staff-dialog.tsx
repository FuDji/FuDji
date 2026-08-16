"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Check, Copy, UserPlus } from "lucide-react";

import { inviteRestaurantStaff, type ActionState } from "@/app/admin/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";

export function InviteRestaurantStaffDialog({ restaurantId }: { restaurantId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(inviteRestaurantStaff, undefined);
  const [copied, setCopied] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(v) => (setOpen(v), setCopied(false))}>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="outline">
          <UserPlus className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pozovi osoblje restorana</DialogTitle>
          <DialogDescription>Kreiraj pozivnicu za portal ovog restorana.</DialogDescription>
        </DialogHeader>
        {state?.inviteLink ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input readOnly value={state.inviteLink} className="text-xs" />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(state.inviteLink!);
                  setCopied(true);
                }}
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setOpen(false)}>
              Zatvori
            </Button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="restaurant_id" value={restaurantId} />
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Ime i prezime</Label>
              <Input id="full_name" name="full_name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            {state?.error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                {state.error}
              </div>
            )}
            <SubmitButton>Kreiraj pozivnicu</SubmitButton>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
