import Link from "next/link";
import Image from "next/image";
import { MapPin, ImageOff } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Apartment } from "@/types";

const STATUS_LABELS: Record<Apartment["status"], string> = {
  active: "aktivan",
  draft: "nacrt",
  archived: "arhiviran",
};

export function ApartmentCard({ apartment }: { apartment: Apartment }) {
  return (
    <Link href={`/apartments/${apartment.slug}/overview`}>
      <Card className="group h-full overflow-hidden py-0 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl">
        <div className="relative h-36 w-full overflow-hidden bg-secondary">
          {apartment.hero_image_url ? (
            <Image
              src={apartment.hero_image_url}
              alt={apartment.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-6" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <Badge
            variant={apartment.status === "active" ? "success" : "secondary"}
            className="absolute right-3 top-3"
          >
            {STATUS_LABELS[apartment.status]}
          </Badge>
        </div>
        <div className="space-y-2 p-5 pt-4">
          <h3 className="font-medium">{apartment.name}</h3>
          {(apartment.city || apartment.country) && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {[apartment.city, apartment.country].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
