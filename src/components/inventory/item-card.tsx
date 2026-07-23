"use client";

import { useTransition } from "react";
import Image from "next/image";
import { CheckCircle2, ImageOff, MapPin, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InventoryStatusBadge } from "@/components/inventory/status-badge";
import { ItemDialog } from "@/components/inventory/item-dialog";
import { deleteInventoryItem, resolveInventoryItem } from "@/app/apartments/[slug]/inventory/actions";
import type { InventoryItem } from "@/types";

export function ItemCard({ apartmentId, slug, item }: { apartmentId: string; slug: string; item: InventoryItem }) {
  const [pending, startTransition] = useTransition();

  return (
    <Card className="flex-row items-center gap-3 p-3">
      <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
        {item.photo_url ? (
          <Image src={item.photo_url} alt={item.name} fill className="object-cover" unoptimized />
        ) : (
          <ImageOff className="size-5 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          {item.quantity} / min {item.min_quantity}
          {item.location && (
            <>
              {" · "}
              <MapPin className="inline size-3" /> {item.location}
            </>
          )}
        </p>
      </div>
      <InventoryStatusBadge status={item.status} />
      <div className="flex shrink-0 items-center gap-1">
        {item.status !== "ok" && (
          <Button
            variant="ghost"
            size="icon-sm"
            title="Mark resolved"
            disabled={pending}
            onClick={() => startTransition(() => resolveInventoryItem(item.id, slug))}
          >
            <CheckCircle2 className="size-3.5 text-success" />
          </Button>
        )}
        <ItemDialog apartmentId={apartmentId} slug={slug} item={item} />
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={pending}
          onClick={() => startTransition(() => deleteInventoryItem(item.id, slug))}
        >
          <Trash2 className="size-3.5 text-destructive" />
        </Button>
      </div>
    </Card>
  );
}
