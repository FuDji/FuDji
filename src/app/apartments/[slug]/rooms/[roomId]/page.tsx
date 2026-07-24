import { notFound } from "next/navigation";
import { Plus } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getOwnedApartment } from "@/lib/data/apartments";
import { getRoom, listRoomItems } from "@/lib/data/rooms";
import { RoomHeader } from "@/components/rooms/room-header";
import { ItemList } from "@/components/rooms/item-list";
import { ItemDialog } from "@/components/rooms/item-dialog";
import { Button } from "@/components/ui/button";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string; roomId: string }>;
}) {
  const { slug, roomId } = await params;
  const { supabase, user } = await requireUser();
  const apartment = await getOwnedApartment(supabase, slug, user.id);
  if (!apartment) notFound();

  const room = await getRoom(supabase, roomId);
  if (!room || room.apartment_id !== apartment.id) notFound();

  const items = await listRoomItems(supabase, roomId);

  return (
    <div>
      <RoomHeader slug={slug} room={room} />

      <div className="mb-4 flex justify-end">
        <ItemDialog
          apartmentId={apartment.id}
          roomId={roomId}
          slug={slug}
          trigger={
            <Button>
              <Plus className="size-4" /> Dodaj stavku
            </Button>
          }
        />
      </div>

      <ItemList apartmentId={apartment.id} roomId={roomId} slug={slug} items={items} />
    </div>
  );
}
