"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Check, Copy, UserPlus } from "lucide-react";

import { inviteEmployee, type ActionState } from "@/app/company/actions";
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

export function InviteEmployeeDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(inviteEmployee, undefined);
  const [copied, setCopied] = useState(false);

  function copyLink() {
    if (!state?.inviteLink) return;
    navigator.clipboard.writeText(state.inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        setCopied(false);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="size-4" /> Pozovi zaposlenog
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pozovi zaposlenog</DialogTitle>
          <DialogDescription>Napravi pozivnicu i pošalji link zaposlenom.</DialogDescription>
        </DialogHeader>

        {state?.inviteLink ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Pozivnica je kreirana. Pošalji ovaj link zaposlenom (email slanje nije povezano):
            </p>
            <div className="flex items-center gap-2">
              <Input readOnly value={state.inviteLink} className="text-xs" />
              <Button type="button" size="icon" variant="outline" onClick={copyLink}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setOpen(false)}>
              Zatvori
            </Button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Ime i prezime</Label>
              <Input id="full_name" name="full_name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="daily_budget_override">Dnevni budžet (opciono, RSD)</Label>
              <Input id="daily_budget_override" name="daily_budget_override" type="number" placeholder="Podrazumevani budžet firme" />
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
