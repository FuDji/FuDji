import { notFound } from "next/navigation";
import { DoorOpen } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getOwnedApartment } from "@/lib/data/apartments";
import { listRooms } from "@/lib/data/rooms";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { AddRoomDialog } from "@/components/rooms/add-room-dialog";
import { RoomCard } from "@/components/rooms/room-card";

export default async function RoomGuidesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user } = await requireUser();
  const apartment = await getOwnedApartment(supabase, slug, user.id);
  if (!apartment) notFound();

  const rooms = await listRooms(supabase, apartment.id);

  return (
    <div>
      <PageHeader
        title="Vodiči po sobama"
        description="Uputstva, upozorenja i saveti za svaki uređaj, soba po soba."
        actions={<AddRoomDialog apartmentId={apartment.id} slug={slug} />}
      />

      {rooms.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title="Još nema soba"
          description="Dodaj Kuhinju, Kupatilo ili Dnevnu sobu da počneš da vodiš goste kroz apartman."
          action={<AddRoomDialog apartmentId={apartment.id} slug={slug} />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} slug={slug} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
