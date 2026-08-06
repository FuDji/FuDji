"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Pencil, Plus } from "lucide-react";

import { upsertReward, type ActionState } from "@/app/admin/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from "@/components/auth/submit-button";
import { REWARD_TYPE_LABELS } from "@/lib/constants";
import type { LoyaltyReward } from "@/types";

export function RewardDialog({ reward }: { reward?: LoyaltyReward }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(upsertReward, undefined);
  const [type, setType] = useState(reward?.reward_type ?? "free_meal");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {reward ? (
          <Button size="icon-sm" variant="outline">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" /> Nova nagrada
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{reward ? "Izmeni nagradu" : "Nova nagrada"}</DialogTitle>
        </DialogHeader>
        <form
          action={(fd) => {
            formAction(fd);
            if (!reward) setOpen(false);
          }}
          className="space-y-4"
        >
          {reward && <input type="hidden" name="id" value={reward.id} />}
          <input type="hidden" name="reward_type" value={type} />

          <div className="space-y-1.5">
            <Label htmlFor="title">Naslov</Label>
            <Input id="title" name="title" defaultValue={reward?.title} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Opis</Label>
            <Textarea id="description" name="description" defaultValue={reward?.description ?? ""} rows={2} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tip nagrade</Label>
              <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(REWARD_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="points_cost">Cena u poenima</Label>
              <Input id="points_cost" name="points_cost" type="number" defaultValue={reward?.points_cost ?? 100} required />
            </div>
          </div>

          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {state.error}
            </div>
          )}

          <SubmitButton>Sačuvaj</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
