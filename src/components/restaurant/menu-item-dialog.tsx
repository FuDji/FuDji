"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Pencil, Plus } from "lucide-react";

import { upsertMenuItem, type ActionState } from "@/app/restaurant/actions";
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
import { MENU_CATEGORIES } from "@/lib/constants";
import type { MenuItem } from "@/types";

export function MenuItemDialog({ item }: { item?: MenuItem }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(upsertMenuItem, undefined);
  const [category, setCategory] = useState(item?.category ?? "main");

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>
        {item ? (
          <Button size="icon-sm" variant="outline">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" /> Novo jelo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Izmeni jelo" : "Novo jelo"}</DialogTitle>
        </DialogHeader>
        <form
          action={(formData) => {
            formAction(formData);
            if (!item) setOpen(false);
          }}
          className="space-y-4"
        >
          {item && <input type="hidden" name="id" value={item.id} />}
          <input type="hidden" name="category" value={category} />

          <div className="space-y-1.5">
            <Label htmlFor="name">Naziv</Label>
            <Input id="name" name="name" defaultValue={item?.name} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Opis</Label>
            <Textarea id="description" name="description" defaultValue={item?.description ?? ""} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="image_url">URL slike</Label>
            <Input id="image_url" name="image_url" type="url" defaultValue={item?.image_url ?? ""} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Cena (RSD)</Label>
              <Input id="price" name="price" type="number" defaultValue={item?.price ?? ""} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="calories">Kalorije</Label>
              <Input id="calories" name="calories" type="number" defaultValue={item?.calories ?? ""} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Kategorija</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MENU_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
