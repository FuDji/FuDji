import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarCheck, CalendarX, ImageOff, MapPin, Phone, ShieldAlert } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getPublicApartment } from "@/lib/data/apartments";
import { getPublicGuideSections, getPublicRooms, logGuideView } from "@/lib/data/public";
import { getContrastColor, withDefaultBrandColor } from "@/lib/color";
import { WifiCard } from "@/components/guest/wifi-card";
import { SectionNav } from "@/components/guest/section-nav";
import { SectionCard } from "@/components/guest/section-card";
import { RoomGrid } from "@/components/guest/room-grid";
import { GalleryStrip } from "@/components/guest/gallery-strip";
import { ConciergeWidget } from "@/components/guest/concierge-widget";
import { Button } from "@/components/ui/button";

export default async function GuestGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const apartment = await getPublicApartment(supabase, slug);
  if (!apartment) notFound();

  const [sections, rooms] = await Promise.all([
    getPublicGuideSections(supabase, apartment.id),
    getPublicRooms(supabase, apartment.id),
  ]);

  await logGuideView(supabase, apartment.id, null).catch(() => {});

  const contacts = apartment.emergency_contacts;
  const brandColor = withDefaultBrandColor(apartment.brand_color);
  const brandStyle = {
    "--primary": brandColor,
    "--ring": brandColor,
    "--primary-foreground": getContrastColor(brandColor),
  } as React.CSSProperties;

  return (
    <div className="min-h-screen pb-24" style={brandStyle}>
      <div className="relative h-64 w-full bg-secondary sm:h-80">
        {apartment.hero_image_url ? (
          <Image src={apartment.hero_image_url} alt={apartment.name} fill priority className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-2xl px-4">
        <div className="-mt-12 mb-6 rounded-2xl border border-border bg-card p-5">
          {apartment.logo_url && (
            <div className="relative -mt-14 mb-3 size-16 overflow-hidden rounded-2xl border-4 border-card bg-card">
              <Image src={apartment.logo_url} alt="" fill className="object-cover" unoptimized />
            </div>
          )}
          <h1 className="text-2xl font-semibold">{apartment.name}</h1>
          {(apartment.address || apartment.city) && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {[apartment.address, apartment.city, apartment.country].filter(Boolean).join(", ")}
            </p>
          )}
          {apartment.description && (
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">{apartment.description}</p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-3">
              <CalendarCheck className="mb-1.5 size-4 text-primary" />
              <p className="text-xs text-muted-foreground">Prijava</p>
              <p className="text-sm font-medium">{apartment.check_in_time}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <CalendarX className="mb-1.5 size-4 text-primary" />
              <p className="text-xs text-muted-foreground">Odjava</p>
              <p className="text-sm font-medium">{apartment.check_out_time}</p>
            </div>
          </div>

          {apartment.phone && (
            <Button asChild className="mt-3 w-full">
              <a href={`tel:${apartment.phone}`}>
                <Phone className="size-4" /> Pozovite domaćina
              </a>
            </Button>
          )}
        </div>

        <GalleryStrip images={apartment.apartment_gallery} />

        {apartment.wifi_name && apartment.wifi_password && (
          <div className="mb-6">
            <WifiCard name={apartment.wifi_name} password={apartment.wifi_password} />
          </div>
        )}

        {rooms.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">Istraži apartman</h2>
            <RoomGrid slug={slug} rooms={rooms} />
          </div>
        )}
      </div>

      <SectionNav sections={sections} />

      <div className="mx-auto max-w-2xl space-y-4 px-4 pt-6">
        {sections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}

        {contacts.length > 0 && (
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <ShieldAlert className="size-5" />
              </div>
              <h2 className="text-lg font-semibold">Hitni kontakti</h2>
            </div>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <a
                  key={contact.id}
                  href={`tel:${contact.phone}`}
                  className="flex items-center justify-between rounded-xl border border-border p-3"
                >
                  <span className="text-sm">{contact.label}</span>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                    <Phone className="size-3.5" /> {contact.phone}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      <ConciergeWidget apartmentId={apartment.id} apartmentName={apartment.name} />
    </div>
  );
}
