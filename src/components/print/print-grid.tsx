"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/lib/icon-map";
import { PRINT_TEMPLATES } from "@/lib/constants";
import {
  generateCleaningChecklistPdf,
  generateEmergencyContactsPdf,
  generateHouseRulesPdf,
  generateInventoryChecklistPdf,
  generateParkingPdf,
  generateQrPostersPdf,
  generateRoomLabelsPdf,
  generateWelcomeBookPdf,
  generateWifiCardPdf,
} from "@/lib/pdf/templates";
import type { Apartment, EmergencyContact, GuideSection, InventoryItem, QrCode, Room } from "@/types";

export function PrintGrid({
  apartment,
  sections,
  rooms,
  contacts,
  inventoryItems,
  qrCodes,
  parkingImageUrl,
}: {
  apartment: Apartment;
  sections: GuideSection[];
  rooms: Room[];
  contacts: EmergencyContact[];
  inventoryItems: InventoryItem[];
  qrCodes: QrCode[];
  parkingImageUrl?: string | null;
}) {
  const [generating, setGenerating] = useState<string | null>(null);

  async function handleGenerate(key: string) {
    setGenerating(key);
    try {
      const houseRules = sections.find((s) => s.key === "house_rules");
      switch (key) {
        case "welcome_book":
          await generateWelcomeBookPdf(apartment, sections, contacts);
          break;
        case "house_rules":
          generateHouseRulesPdf(apartment, houseRules);
          break;
        case "wifi_card":
          generateWifiCardPdf(apartment);
          break;
        case "emergency_contacts":
          generateEmergencyContactsPdf(apartment, contacts);
          break;
        case "parking_instructions":
          await generateParkingPdf(apartment, parkingImageUrl);
          break;
        case "room_labels":
          await generateRoomLabelsPdf(apartment, rooms);
          break;
        case "qr_posters":
          await generateQrPostersPdf(apartment, qrCodes, window.location.origin);
          break;
        case "cleaning_checklist":
          generateCleaningChecklistPdf(apartment, rooms);
          break;
        case "inventory_checklist":
          generateInventoryChecklistPdf(apartment, inventoryItems);
          break;
      }
    } finally {
      setGenerating(null);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PRINT_TEMPLATES.map((template) => (
        <Card key={template.key} className="flex flex-col justify-between p-5">
          <div>
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <DynamicIcon name={template.icon} className="size-5" />
            </div>
            <h3 className="font-medium">{template.label}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
          </div>
          <Button
            variant="secondary"
            className="mt-5 w-full"
            onClick={() => handleGenerate(template.key)}
            disabled={generating === template.key}
          >
            {generating === template.key ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Generiši PDF
          </Button>
        </Card>
      ))}
    </div>
  );
}
