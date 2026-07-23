import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ImageOff, Lightbulb, TriangleAlert } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getPublicApartment } from "@/lib/data/apartments";
import { getPublicRoom, getPublicRoomItems } from "@/lib/data/public";
import { DynamicIcon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

export default async function GuestRoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; roomId: string }>;
  searchParams: Promise<{ item?: string }>;
}) {
  const { slug, roomId } = await params;
  const { item: highlightId } = await searchParams;
  const supabase = await createClient();

  const apartment = await getPublicApartment(supabase, slug);
  if (!apartment) notFound();

  const room = await getPublicRoom(supabase, roomId);
  if (!room || room.apartment_id !== apartment.id) notFound();

  const items = await getPublicRoomItems(supabase, roomId);

  return (
    <div className="min-h-screen pb-16">
      <div className="relative h-48 w-full bg-secondary">
        {room.cover_image_url ? (
          <Image src={room.cover_image_url} alt={room.name} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <Link
          href={`/g/${slug}`}
          className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-full bg-background/80 backdrop-blur"
        >
          <ArrowLeft className="size-4" />
        </Link>
      </div>

      <div className="mx-auto max-w-2xl px-4">
        <div className="-mt-8 mb-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <DynamicIcon name={room.icon} className="size-5" />
          </div>
          <h1 className="text-xl font-semibold">{room.name}</h1>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className={cn(
                "scroll-mt-20 rounded-2xl border bg-card p-5",
                highlightId === item.id ? "border-primary shadow-[0_0_0_3px_rgba(79,140,255,0.2)]" : "border-border"
              )}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <DynamicIcon name={item.icon} className="size-4" />
                </div>
                <h3 className="font-medium">{item.name}</h3>
              </div>

              {item.images?.[0] && (
                <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl bg-secondary">
                  <Image src={item.images[0]} alt={item.name} fill className="object-cover" unoptimized />
                </div>
              )}

              {item.instructions && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{item.instructions}</p>
              )}

              {item.video_url && (
                <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl bg-secondary">
                  <video src={item.video_url} controls className="h-full w-full object-cover" />
                </div>
              )}

              {item.tips && (
                <div className="mt-3 flex gap-2.5 rounded-xl bg-success/10 p-3 text-sm text-success">
                  <Lightbulb className="size-4 shrink-0" />
                  <p>{item.tips}</p>
                </div>
              )}

              {item.warnings && (
                <div className="mt-3 flex gap-2.5 rounded-xl bg-warning/10 p-3 text-sm text-warning">
                  <TriangleAlert className="size-4 shrink-0" />
                  <p>{item.warnings}</p>
                </div>
              )}

              {item.faqs?.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-border pt-3">
                  {item.faqs.map((faq, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium">{faq.question}</p>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">No instructions added for this room yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
