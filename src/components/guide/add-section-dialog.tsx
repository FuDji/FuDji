"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GUIDE_SECTION_PRESETS } from "@/lib/constants";
import { DynamicIcon } from "@/lib/icon-map";
import { createGuideSection } from "@/app/apartments/[slug]/guide/actions";
import { slugify, cn } from "@/lib/utils";

export function AddSectionDialog({ apartmentId, slug }: { apartmentId: string; slug: string }) {
  const [open, setOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handlePreset(preset: (typeof GUIDE_SECTION_PRESETS)[number]) {
    startTransition(async () => {
      const id = await createGuideSection(apartmentId, slug, {
        key: preset.key,
        title: preset.title,
        icon: preset.icon,
      });
      setOpen(false);
      router.push(`/apartments/${slug}/guide/${id}`);
    });
  }

  function handleCustom() {
    if (!customTitle.trim()) return;
    startTransition(async () => {
      const id = await createGuideSection(apartmentId, slug, {
        key: slugify(customTitle),
        title: customTitle,
        icon: "Sparkles",
      });
      setOpen(false);
      setCustomTitle("");
      router.push(`/apartments/${slug}/guide/${id}`);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" /> Dodaj sekciju
      </Button>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Dodaj sekciju vodiča za goste</DialogTitle>
          <DialogDescription>Izaberi šablon ili napravi prilagođenu sekciju.</DialogDescription>
        </DialogHeader>

        <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
          {GUIDE_SECTION_PRESETS.map((preset) => (
            <button
              key={preset.key}
              disabled={pending}
              onClick={() => handlePreset(preset)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-center transition-colors hover:border-primary/40 hover:bg-secondary/40 disabled:opacity-50"
              )}
            >
              <DynamicIcon name={preset.icon} className="size-5 text-primary" />
              <span className="text-xs">{preset.title}</span>
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2 border-t border-border pt-4">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="custom-title">Prilagođena sekcija</Label>
            <Input
              id="custom-title"
              placeholder="npr. Lokalne pijace"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />
          </div>
          <Button variant="secondary" onClick={handleCustom} disabled={pending || !customTitle.trim()}>
            Napravi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
