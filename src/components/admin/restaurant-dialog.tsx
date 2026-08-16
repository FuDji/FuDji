"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Pencil, Plus } from "lucide-react";

import { upsertRestaurant, type ActionState } from "@/app/admin/actions";
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
import { SubmitButton } from "@/components/auth/submit-button";
import type { Restaurant } from "@/types";

export function RestaurantDialog({ restaurant }: { restaurant?: Restaurant }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(upsertRestaurant, undefined);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {restaurant ? (
          <Button size="icon-sm" variant="outline">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" /> Novi restoran
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{restaurant ? "Izmeni restoran" : "Novi restoran"}</DialogTitle>
        </DialogHeader>
        <form
          action={(fd) => {
            formAction(fd);
            if (!restaurant) setOpen(false);
          }}
          className="space-y-4"
        >
          {restaurant && <input type="hidden" name="id" value={restaurant.id} />}
          <div className="space-y-1.5">
            <Label htmlFor="name">Naziv</Label>
            <Input id="name" name="name" defaultValue={restaurant?.name} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="address">Adresa</Label>
              <Input id="address" name="address" defaultValue={restaurant?.address ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" name="phone" defaultValue={restaurant?.phone ?? ""} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Opis</Label>
            <Textarea id="description" name="description" defaultValue={restaurant?.description ?? ""} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="logo_url">URL logotipa</Label>
            <Input id="logo_url" name="logo_url" type="url" defaultValue={restaurant?.logo_url ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="commission_percent">Provizija (%)</Label>
            <Input
              id="commission_percent"
              name="commission_percent"
              type="number"
              step="0.1"
              defaultValue={restaurant?.commission_percent ?? 10}
              required
            />
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
