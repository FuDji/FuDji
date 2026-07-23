"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DynamicIcon } from "@/lib/icon-map";
import { generateSectionQr } from "@/app/apartments/[slug]/qr-codes/actions";
import type { GuideSection } from "@/types";

export function GenerateSectionQrDialog({
  apartmentId,
  slug,
  sections,
}: {
  apartmentId: string;
  slug: string;
  sections: GuideSection[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function generate(section: GuideSection) {
    startTransition(async () => {
      await generateSectionQr(apartmentId, slug, section.id, section.title);
      setOpen(false);
    });
  }

  if (sections.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Plus className="size-4" /> Generate QR for guide section
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate a QR code</DialogTitle>
          <DialogDescription>Pick a guest guide section to link directly.</DialogDescription>
        </DialogHeader>
        <div className="max-h-72 space-y-1 overflow-y-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              disabled={pending}
              onClick={() => generate(section)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-secondary/60 disabled:opacity-50"
            >
              <DynamicIcon name={section.icon} className="size-4 text-primary" />
              {section.title}
              {pending && <Loader2 className="ml-auto size-4 animate-spin" />}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
