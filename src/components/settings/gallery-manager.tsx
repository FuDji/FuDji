"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addGalleryImage, removeGalleryImage } from "@/app/apartments/actions";
import type { Database } from "@/types/database";

type GalleryImage = Database["public"]["Tables"]["apartment_gallery"]["Row"];

export function GalleryManager({ apartmentId, images }: { apartmentId: string; images: GalleryImage[] }) {
  const [url, setUrl] = useState("");
  const [pending, startTransition] = useTransition();

  function add() {
    if (!url.trim()) return;
    startTransition(async () => {
      await addGalleryImage(apartmentId, url);
      setUrl("");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Gallery</CardTitle>
        <CardDescription>Extra photos shown on the guest guide.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-secondary">
              <Image src={img.url} alt="" fill className="object-cover" unoptimized />
              <button
                onClick={() => startTransition(() => removeGalleryImage(img.id))}
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-end gap-2">
          <Input placeholder="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button onClick={add} disabled={pending || !url.trim()}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
