import Link from "next/link";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import { DynamicIcon } from "@/lib/icon-map";

export function RoomCard({
  slug,
  room,
}: {
  slug: string;
  room: { id: string; name: string; icon: string | null; cover_image_url: string | null; itemCount: number };
}) {
  return (
    <Link href={`/apartments/${slug}/rooms/${room.id}`}>
      <Card className="group h-full overflow-hidden py-0 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl">
        <div className="relative h-28 w-full overflow-hidden bg-secondary">
          {room.cover_image_url ? (
            <Image
              src={room.cover_image_url}
              alt={room.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <DynamicIcon name={room.icon} className="size-8 text-primary/40" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <DynamicIcon name={room.icon} className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{room.name}</p>
            <p className="text-xs text-muted-foreground">{room.itemCount} stavki</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
