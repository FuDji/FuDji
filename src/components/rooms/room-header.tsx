"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/page-header";
import { deleteRoom, updateRoom } from "@/app/apartments/[slug]/rooms/actions";
import type { Room } from "@/types";

export function RoomHeader({ slug, room }: { slug: string; room: Room }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(room.name);
  const [coverImage, setCoverImage] = useState(room.cover_image_url ?? "");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function save() {
    startTransition(async () => {
      await updateRoom(room.id, slug, { name, icon: room.icon ?? "DoorOpen", cover_image_url: coverImage });
      setOpen(false);
    });
  }

  function remove() {
    startTransition(async () => {
      await deleteRoom(room.id, slug);
      router.push(`/apartments/${slug}/rooms`);
    });
  }

  return (
    <>
      <PageHeader
        title={room.name}
        description="Upravljaj uputstvima, upozorenjima i savetima za svaki uređaj u ovoj sobi."
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpen(true)}>
              <Pencil className="size-4" /> Uredi sobu
            </Button>
            <Button variant="outline" onClick={remove} disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            </Button>
          </>
        }
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uredi sobu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="room-name">Naziv</Label>
              <Input id="room-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="room-cover">URL naslovne slike</Label>
              <Input id="room-cover" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Otkaži
            </Button>
            <Button onClick={save} disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              Sačuvaj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
