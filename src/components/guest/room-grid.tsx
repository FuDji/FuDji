import Link from "next/link";
import Image from "next/image";

import { DynamicIcon } from "@/lib/icon-map";
import type { Room } from "@/types";

export function RoomGrid({ slug, rooms }: { slug: string; rooms: Room[] }) {
  if (rooms.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {rooms.map((room) => (
        <Link
          key={room.id}
          href={`/g/${slug}/rooms/${room.id}`}
          className="group overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="relative h-20 w-full bg-secondary">
            {room.cover_image_url ? (
              <Image src={room.cover_image_url} alt={room.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center">
                <DynamicIcon name={room.icon} className="size-6 text-primary/40" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 p-3">
            <DynamicIcon name={room.icon} className="size-4 text-primary" />
            <span className="truncate text-sm font-medium">{room.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
