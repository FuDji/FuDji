import QRCode from "qrcode";

import {
  bodyText,
  checkboxLine,
  createDoc,
  drawFooter,
  drawHeader,
  ensureSpace,
  labelValue,
  loadImageAsDataUrl,
  sectionTitle,
  PDF_LAYOUT,
} from "@/lib/pdf/builder";
import { withDefaultBrandColor } from "@/lib/color";
import type { Apartment, EmergencyContact, GuideSection, Room, InventoryItem } from "@/types";

function save(doc: ReturnType<typeof createDoc>, filename: string) {
  doc.save(filename);
}

function textOfSection(section?: GuideSection) {
  if (!section) return "";
  return section.blocks
    .filter((b) => b.type === "text")
    .map((b) => b.content)
    .filter(Boolean)
    .join("\n\n");
}

export function generateHouseRulesPdf(apartment: Apartment, houseRulesSection?: GuideSection) {
  const accentColor = withDefaultBrandColor(apartment.brand_color);
  const doc = createDoc();
  const y = drawHeader(doc, apartment.name, "Kućna pravila", { accentColor });
  const text = textOfSection(houseRulesSection) || "Kućna pravila još nisu dodata.";
  bodyText(doc, text, y);
  drawFooter(doc, apartment.name, 1);
  save(doc, `${apartment.slug}-kucna-pravila.pdf`);
}

export function generateWifiCardPdf(apartment: Apartment) {
  const accentColor = withDefaultBrandColor(apartment.brand_color);
  const doc = createDoc();
  drawHeader(doc, apartment.name, "Pristup WiFi mreži", { accentColor });
  const y = 70;
  const y2 = labelValue(doc, "Mreža", apartment.wifi_name || "—", y);
  labelValue(doc, "Lozinka", apartment.wifi_password || "—", y2 + 6);
  drawFooter(doc, apartment.name, 1);
  save(doc, `${apartment.slug}-wifi-kartica.pdf`);
}

export function generateEmergencyContactsPdf(apartment: Apartment, contacts: EmergencyContact[]) {
  const accentColor = withDefaultBrandColor(apartment.brand_color);
  const doc = createDoc();
  let y = drawHeader(doc, apartment.name, "Hitni kontakti", { accentColor });
  if (contacts.length === 0) {
    bodyText(doc, "Hitni kontakti još nisu dodati.", y);
  } else {
    for (const contact of contacts) {
      y = labelValue(doc, contact.label, contact.phone, y);
    }
  }
  drawFooter(doc, apartment.name, 1);
  save(doc, `${apartment.slug}-hitni-kontakti.pdf`);
}

export async function generateParkingPdf(apartment: Apartment, imageUrl?: string | null) {
  const accentColor = withDefaultBrandColor(apartment.brand_color);
  const doc = createDoc();
  let y = drawHeader(doc, apartment.name, "Uputstvo za parking", { accentColor });
  y = bodyText(doc, apartment.parking_info || "Uputstvo za parking još nije dodato.", y);

  if (imageUrl) {
    const dataUrl = await loadImageAsDataUrl(imageUrl);
    if (dataUrl) {
      const { PAGE_W, MARGIN } = PDF_LAYOUT;
      const imgW = PAGE_W - MARGIN * 2;
      const imgH = imgW * 0.6;
      try {
        doc.addImage(dataUrl, MARGIN, y + 6, imgW, imgH, undefined, "FAST");
      } catch {
        // ignore malformed image data — the rest of the PDF still generates fine
      }
    }
  }

  drawFooter(doc, apartment.name, 1);
  save(doc, `${apartment.slug}-parking.pdf`);
}

export async function generateRoomLabelsPdf(apartment: Apartment, rooms: Room[]) {
  const logoDataUrl = apartment.logo_url ? await loadImageAsDataUrl(apartment.logo_url) : null;
  const doc = createDoc();
  const { PAGE_W, PAGE_H } = PDF_LAYOUT;
  const cols = 2;
  const rows = 4;
  const cellW = (PAGE_W - 20) / cols;
  const cellH = (PAGE_H - 20) / rows;
  const logoSize = 7;

  rooms.forEach((room, i) => {
    const pageIndex = Math.floor(i / (cols * rows));
    const indexInPage = i % (cols * rows);
    if (indexInPage === 0) {
      if (pageIndex > 0) doc.addPage();
    }
    const col = indexInPage % cols;
    const row = Math.floor(indexInPage / cols);
    const x = 10 + col * cellW;
    const y = 10 + row * cellH;
    const centerX = x + cellW / 2;
    const centerY = y + cellH / 2;

    doc.setDrawColor(220, 220, 225);
    doc.roundedRect(x + 4, y + 4, cellW - 8, cellH - 8, 4, 4);

    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, centerX - logoSize / 2, centerY - 15, logoSize, logoSize, undefined, "FAST");
      } catch {
        // ignore — label still renders without the logo
      }
    }

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 13, 18);
    doc.text(room.name, centerX, centerY, { align: "center" });
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.text(apartment.name, centerX, centerY + 8, { align: "center" });
  });

  save(doc, `${apartment.slug}-oznake-soba.pdf`);
}

export async function generateQrPostersPdf(
  apartment: Apartment,
  codes: { label: string; slug: string }[],
  origin: string
) {
  const accentColor = withDefaultBrandColor(apartment.brand_color);
  const doc = createDoc();
  const { PAGE_W, PAGE_H, MARGIN } = PDF_LAYOUT;

  for (let i = 0; i < codes.length; i++) {
    if (i > 0) doc.addPage();
    const qr = codes[i];
    const dataUrl = await QRCode.toDataURL(`${origin}/qr/${qr.slug}`, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 600,
      color: { dark: "#0B0D12", light: "#FFFFFF" },
    });

    doc.setFillColor(accentColor);
    doc.rect(0, 0, PAGE_W, 8, "F");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(apartment.name.toUpperCase(), PAGE_W / 2, 30, { align: "center" });
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 13, 18);
    doc.text(qr.label, PAGE_W / 2, 42, { align: "center" });

    const qrSize = 120;
    doc.addImage(dataUrl, "PNG", (PAGE_W - qrSize) / 2, 65, qrSize, qrSize);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Skeniraj za uputstva", PAGE_W / 2, 200, { align: "center" });

    drawFooter(doc, apartment.name, i + 1);
  }
  void PAGE_H;
  void MARGIN;

  save(doc, `${apartment.slug}-qr-posteri.pdf`);
}

const CLEANING_TASKS = [
  "Skini i presvuci sve krevete čistom posteljinom",
  "Očisti i dezinfikuj kupatilo/a",
  "Obriši površine i uređaje u kuhinji",
  "Isprazni sve kante za smeće",
  "Usisaj / opere sve podove",
  "Dopuni toaletne potrepštine i papirne proizvode",
  "Proveri i dopuni dobrodošlicu (amenities)",
  "Obriši prozore i ogledala",
  "Proveri ima li štete ili nedostajućih stvari",
  "Iznesi reciklažu",
];

export function generateCleaningChecklistPdf(apartment: Apartment, rooms: Room[]) {
  const accentColor = withDefaultBrandColor(apartment.brand_color);
  const doc = createDoc();
  const page = { n: 1 };
  let y = drawHeader(doc, apartment.name, "Lista za čišćenje", { accentColor });
  y = sectionTitle(doc, "Opšti zadaci", y, accentColor);
  for (const task of CLEANING_TASKS) {
    y = ensureSpace(doc, y, 10, apartment.name, page);
    y = checkboxLine(doc, task, y, accentColor);
  }
  if (rooms.length > 0) {
    y = ensureSpace(doc, y, 16, apartment.name, page);
    y = sectionTitle(doc, "Sobe", y + 4, accentColor);
    for (const room of rooms) {
      y = ensureSpace(doc, y, 10, apartment.name, page);
      y = checkboxLine(doc, `${room.name} — očišćeno i pregledano`, y, accentColor);
    }
  }
  drawFooter(doc, apartment.name, page.n);
  save(doc, `${apartment.slug}-lista-ciscenja.pdf`);
}

const CATEGORY_LABELS: Record<string, string> = {
  kitchen: "Kuhinja",
  bathroom: "Kupatilo",
  bedroom: "Spavaća soba",
  living_room: "Dnevna soba",
  outdoor: "Spolja",
  cleaning_supplies: "Sredstva za čišćenje",
};

export function generateInventoryChecklistPdf(apartment: Apartment, items: InventoryItem[]) {
  const accentColor = withDefaultBrandColor(apartment.brand_color);
  const doc = createDoc();
  const page = { n: 1 };
  let y = drawHeader(doc, apartment.name, "Lista inventara", { accentColor });
  const byCategory = items.reduce<Record<string, InventoryItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});
  for (const [category, categoryItems] of Object.entries(byCategory)) {
    y = ensureSpace(doc, y, 14, apartment.name, page);
    y = sectionTitle(doc, CATEGORY_LABELS[category] ?? category, y + 4, accentColor);
    for (const item of categoryItems) {
      y = ensureSpace(doc, y, 10, apartment.name, page);
      y = checkboxLine(doc, `${item.name} — kom. ${item.quantity}`, y, accentColor);
    }
  }
  drawFooter(doc, apartment.name, page.n);
  save(doc, `${apartment.slug}-lista-inventara.pdf`);
}

export async function generateWelcomeBookPdf(
  apartment: Apartment,
  sections: GuideSection[],
  contacts: EmergencyContact[]
) {
  const accentColor = withDefaultBrandColor(apartment.brand_color);
  const logoDataUrl = apartment.logo_url ? await loadImageAsDataUrl(apartment.logo_url) : null;

  const doc = createDoc();
  const page = { n: 1 };

  // Cover
  doc.setFillColor("#0B0D12");
  doc.rect(0, 0, PDF_LAYOUT.PAGE_W, PDF_LAYOUT.PAGE_H, "F");
  doc.setFillColor(accentColor);
  doc.rect(0, 0, PDF_LAYOUT.PAGE_W, 4, "F");
  if (logoDataUrl) {
    const logoSize = 8.5;
    try {
      doc.addImage(logoDataUrl, (PDF_LAYOUT.PAGE_W - logoSize) / 2, 16, logoSize, logoSize, undefined, "FAST");
    } catch {
      // ignore — cover still renders without the logo
    }
  }
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text("Dobrodošli u", PDF_LAYOUT.MARGIN, 130);
  doc.setFontSize(34);
  doc.text(apartment.name, PDF_LAYOUT.MARGIN, 145);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(
    [apartment.address, apartment.city, apartment.country].filter(Boolean).join(", ") || " ",
    PDF_LAYOUT.MARGIN,
    158
  );

  doc.addPage();
  page.n = 2;
  let y = drawHeader(doc, apartment.name, "Prijava i odjava", { accentColor, logoDataUrl });
  y = labelValue(doc, "Prijava (check-in)", apartment.check_in_time || "—", y);
  y = labelValue(doc, "Odjava (check-out)", apartment.check_out_time || "—", y);
  if (apartment.wifi_name) {
    y = labelValue(doc, "WiFi mreža", apartment.wifi_name, y + 4);
    y = labelValue(doc, "WiFi lozinka", apartment.wifi_password || "—", y);
  }

  for (const section of sections.filter((s) => s.published)) {
    y = ensureSpace(doc, y, 30, apartment.name, page);
    y = sectionTitle(doc, section.title, y + 6, accentColor);
    const text = textOfSection(section);
    y = bodyText(doc, text || "—", y);
  }

  if (contacts.length > 0) {
    y = ensureSpace(doc, y, 20, apartment.name, page);
    y = sectionTitle(doc, "Hitni kontakti", y + 6, accentColor);
    for (const contact of contacts) {
      y = ensureSpace(doc, y, 12, apartment.name, page);
      y = labelValue(doc, contact.label, contact.phone, y);
    }
  }

  drawFooter(doc, apartment.name, page.n);
  save(doc, `${apartment.slug}-knjiga-dobrodoslice.pdf`);
}
