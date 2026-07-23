"use client";

import { useTransition } from "react";
import { Pencil, Trash2, Wrench } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/layout/empty-state";
import { DynamicIcon } from "@/lib/icon-map";
import { ItemDialog } from "@/components/rooms/item-dialog";
import { deleteRoomItem } from "@/app/apartments/[slug]/rooms/actions";
import type { RoomItem } from "@/types";

export function ItemList({
  apartmentId,
  roomId,
  slug,
  items,
}: {
  apartmentId: string;
  roomId: string;
  slug: string;
  items: RoomItem[];
}) {
  const [pending, startTransition] = useTransition();

  function remove(id: string) {
    startTransition(async () => {
      await deleteRoomItem(id, roomId, slug);
    });
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Wrench}
        title="No items in this room yet"
        description="Add appliances like the coffee machine, TV or AC so guests always know how to use them."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <DynamicIcon name={item.icon} className="size-4" />
              </div>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <ItemDialog
                apartmentId={apartmentId}
                roomId={roomId}
                slug={slug}
                item={item}
                trigger={
                  <Button variant="ghost" size="icon-sm">
                    <Pencil className="size-3.5" />
                  </Button>
                }
              />
              <Button variant="ghost" size="icon-sm" onClick={() => remove(item.id)} disabled={pending}>
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          </div>
          {item.instructions && (
            <p className="line-clamp-3 text-sm text-muted-foreground">{item.instructions}</p>
          )}
          {(item.faqs?.length ?? 0) > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">{item.faqs.length} FAQ{item.faqs.length === 1 ? "" : "s"}</p>
          )}
        </Card>
      ))}
    </div>
  );
}
