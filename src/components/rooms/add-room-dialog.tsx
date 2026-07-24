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
import { ROOM_PRESETS } from "@/lib/constants";
import { DynamicIcon } from "@/lib/icon-map";
import { createRoom } from "@/app/apartments/[slug]/rooms/actions";
import { cn } from "@/lib/utils";

export function AddRoomDialog({ apartmentId, slug }: { apartmentId: string; slug: string }) {
  const [open, setOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handlePreset(preset: (typeof ROOM_PRESETS)[number]) {
    startTransition(async () => {
      const id = await createRoom(apartmentId, slug, { name: preset.name, icon: preset.icon });
      setOpen(false);
      router.push(`/apartments/${slug}/rooms/${id}`);
    });
  }

  function handleCustom() {
    if (!customName.trim()) return;
    startTransition(async () => {
      const id = await createRoom(apartmentId, slug, { name: customName, icon: "DoorOpen" });
      setOpen(false);
      setCustomName("");
      router.push(`/apartments/${slug}/rooms/${id}`);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" /> Dodaj sobu
      </Button>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Dodaj sobu</DialogTitle>
          <DialogDescription>Svaka soba automatski dobija svoj QR kod.</DialogDescription>
        </DialogHeader>

        <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
          {ROOM_PRESETS.map((preset) => (
            <button
              key={preset.name}
              disabled={pending}
              onClick={() => handlePreset(preset)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-center transition-colors hover:border-primary/40 hover:bg-secondary/40 disabled:opacity-50"
              )}
            >
              <DynamicIcon name={preset.icon} className="size-5 text-primary" />
              <span className="text-xs">{preset.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2 border-t border-border pt-4">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="custom-room">Prilagođena soba</Label>
            <Input
              id="custom-room"
              placeholder="npr. Radna soba"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </div>
          <Button variant="secondary" onClick={handleCustom} disabled={pending || !customName.trim()}>
            Napravi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
