"use client";

import { useActionState, useEffect, useState } from "react";
import { AlertCircle, Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from "@/components/auth/submit-button";
import { INVENTORY_CATEGORIES } from "@/lib/constants";
import { createInventoryItem, updateInventoryItem, type FormState } from "@/app/apartments/[slug]/inventory/actions";
import type { InventoryItem } from "@/types";

export function ItemDialog({
  apartmentId,
  slug,
  item,
  defaultCategory,
}: {
  apartmentId: string;
  slug: string;
  item?: InventoryItem;
  defaultCategory?: string;
}) {
  const [open, setOpen] = useState(false);
  const action = item
    ? updateInventoryItem.bind(null, item.id, slug)
    : createInventoryItem.bind(null, apartmentId, slug);
  const [state, formAction] = useActionState<FormState, FormData>(action, undefined);

  useEffect(() => {
    if (state && !state.error) setOpen(false);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {item ? (
        <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)}>
          <Pencil className="size-3.5" />
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Add item
        </Button>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit item" : "Add inventory item"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="inv-name">Name</Label>
            <Input id="inv-name" name="name" defaultValue={item?.name} placeholder="6 Plates" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inv-category">Category</Label>
            <Select name="category" defaultValue={item?.category ?? defaultCategory ?? "kitchen"}>
              <SelectTrigger id="inv-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INVENTORY_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="inv-qty">Quantity</Label>
              <Input id="inv-qty" name="quantity" type="number" min={0} defaultValue={item?.quantity ?? 1} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-min">Minimum quantity</Label>
              <Input
                id="inv-min"
                name="min_quantity"
                type="number"
                min={0}
                defaultValue={item?.min_quantity ?? 1}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inv-location">Location</Label>
            <Input id="inv-location" name="location" defaultValue={item?.location ?? ""} placeholder="Kitchen cabinet" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inv-photo">Photo URL</Label>
            <Input id="inv-photo" name="photo_url" defaultValue={item?.photo_url ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inv-notes">Notes</Label>
            <Textarea id="inv-notes" name="notes" rows={2} defaultValue={item?.notes ?? ""} />
          </div>

          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {state.error}
            </div>
          )}

          <SubmitButton>{item ? "Save changes" : "Add item"}</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
