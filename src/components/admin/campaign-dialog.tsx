"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Pencil, Plus } from "lucide-react";

import { upsertCampaign, type ActionState } from "@/app/admin/actions";
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
import { CAMPAIGN_TYPE_LABELS } from "@/lib/constants";
import type { Campaign, Restaurant } from "@/types";

export function CampaignDialog({
  campaign,
  restaurants,
}: {
  campaign?: Campaign;
  restaurants: Pick<Restaurant, "id" | "name">[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(upsertCampaign, undefined);
  const [type, setType] = useState(campaign?.campaign_type ?? "discount");
  const [restaurantId, setRestaurantId] = useState(campaign?.restaurant_id ?? "");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {campaign ? (
          <Button size="icon-sm" variant="outline">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" /> Nova kampanja
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{campaign ? "Izmeni kampanju" : "Nova kampanja"}</DialogTitle>
        </DialogHeader>
        <form
          action={(fd) => {
            formAction(fd);
            if (!campaign) setOpen(false);
          }}
          className="space-y-4"
        >
          {campaign && <input type="hidden" name="id" value={campaign.id} />}
          <input type="hidden" name="campaign_type" value={type} />
          <input type="hidden" name="restaurant_id" value={restaurantId} />

          <div className="space-y-1.5">
            <Label htmlFor="title">Naslov</Label>
            <Input id="title" name="title" placeholder="npr. Taco Tuesday" defaultValue={campaign?.title} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Opis</Label>
            <Textarea id="description" name="description" defaultValue={campaign?.description ?? ""} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="image_url">URL slike</Label>
            <Input id="image_url" name="image_url" type="url" defaultValue={campaign?.image_url ?? ""} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tip kampanje</Label>
              <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CAMPAIGN_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="discount_percent">Popust (%)</Label>
              <Input id="discount_percent" name="discount_percent" type="number" defaultValue={campaign?.discount_percent ?? ""} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Restoran (opciono — prazno = svi)</Label>
            <Select value={restaurantId || "all"} onValueChange={(v) => setRestaurantId(v === "all" ? "" : v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi restorani</SelectItem>
                {restaurants.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="starts_at">Počinje</Label>
              <Input id="starts_at" name="starts_at" type="date" defaultValue={campaign?.starts_at} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ends_at">Ističe (opciono)</Label>
              <Input id="ends_at" name="ends_at" type="date" defaultValue={campaign?.ends_at ?? ""} />
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
