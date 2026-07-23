import QRCode from "qrcode";

import {
  bodyText,
  checkboxLine,
  createDoc,
  drawFooter,
  drawHeader,
  ensureSpace,
  labelValue,
  sectionTitle,
  PDF_LAYOUT,
} from "@/lib/pdf/builder";
import type { Apartment, EmergencyContact, GuideSection, Room, InventoryItem, QrCode as QrCodeRow } from "@/types";

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
  const doc = createDoc();
  let y = drawHeader(doc, apartment.name, "House Rules");
  const text = textOfSection(houseRulesSection) || "House rules have not been added yet.";
  y = bodyText(doc, text, y);
  drawFooter(doc, apartment.name, 1);
  save(doc, `${apartment.slug}-house-rules.pdf`);
}

export function generateWifiCardPdf(apartment: Apartment) {
  const doc = createDoc();
  drawHeader(doc, apartment.name, "WiFi Access");
  let y = 70;
  y = labelValue(doc, "Network", apartment.wifi_name || "—", y);
  y = labelValue(doc, "Password", apartment.wifi_password || "—", y + 6);
  drawFooter(doc, apartment.name, 1);
  save(doc, `${apartment.slug}-wifi-card.pdf`);
}

export function generateEmergencyContactsPdf(apartment: Apartment, contacts: EmergencyContact[]) {
  const doc = createDoc();
  let y = drawHeader(doc, apartment.name, "Emergency Contacts");
  if (contacts.length === 0) {
    bodyText(doc, "No emergency contacts have been added yet.", y);
  } else {
    for (const contact of contacts) {
      y = labelValue(doc, contact.label, contact.phone, y);
    }
  }
  drawFooter(doc, apartment.name, 1);
  save(doc, `${apartment.slug}-emergency-contacts.pdf`);
}

export function generateParkingPdf(apartment: Apartment) {
  const doc = createDoc();
  let y = drawHeader(doc, apartment.name, "Parking Instructions");
  y = bodyText(doc, apartment.parking_info || "Parking instructions have not been added yet.", y);
  drawFooter(doc, apartment.name, 1);
  save(doc, `${apartment.slug}-parking.pdf`);
}

export function generateRoomLabelsPdf(apartment: Apartment, rooms: Room[]) {
  const doc = createDoc();
  const { PAGE_W, PAGE_H } = PDF_LAYOUT;
  const cols = 2;
  const rows = 4;
  const cellW = (PAGE_W - 20) / cols;
  const cellH = (PAGE_H - 20) / rows;

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

    doc.setDrawColor(220, 220, 225);
    doc.roundedRect(x + 4, y + 4, cellW - 8, cellH - 8, 4, 4);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 13, 18);
    doc.text(room.name, x + cellW / 2, y + cellH / 2, { align: "center" });
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.text(apartment.name, x + cellW / 2, y + cellH / 2 + 8, { align: "center" });
  });

  save(doc, `${apartment.slug}-room-labels.pdf`);
}

export async function generateQrPostersPdf(
  apartment: Apartment,
  codes: { label: string; slug: string }[],
  origin: string
) {
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

    doc.setFillColor("#4F8CFF");
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
    doc.text("Scan for instructions", PAGE_W / 2, 200, { align: "center" });

    drawFooter(doc, apartment.name, i + 1);
  }
  void PAGE_H;
  void MARGIN;

  save(doc, `${apartment.slug}-qr-posters.pdf`);
}

const CLEANING_TASKS = [
  "Strip and remake all beds with fresh linens",
  "Clean and disinfect bathroom(s)",
  "Wipe down kitchen surfaces & appliances",
  "Empty all trash bins",
  "Vacuum / mop all floors",
  "Restock toiletries and paper products",
  "Check and restock welcome amenities",
  "Wipe windows & mirrors",
  "Check for damage or missing items",
  "Take out recycling",
];

export function generateCleaningChecklistPdf(apartment: Apartment, rooms: Room[]) {
  const doc = createDoc();
  const page = { n: 1 };
  let y = drawHeader(doc, apartment.name, "Cleaning Checklist");
  y = sectionTitle(doc, "General tasks", y);
  for (const task of CLEANING_TASKS) {
    y = ensureSpace(doc, y, 10, apartment.name, page);
    y = checkboxLine(doc, task, y);
  }
  if (rooms.length > 0) {
    y = ensureSpace(doc, y, 16, apartment.name, page);
    y = sectionTitle(doc, "Rooms", y + 4);
    for (const room of rooms) {
      y = ensureSpace(doc, y, 10, apartment.name, page);
      y = checkboxLine(doc, `${room.name} — cleaned & inspected`, y);
    }
  }
  drawFooter(doc, apartment.name, page.n);
  save(doc, `${apartment.slug}-cleaning-checklist.pdf`);
}

export function generateInventoryChecklistPdf(apartment: Apartment, items: InventoryItem[]) {
  const doc = createDoc();
  const page = { n: 1 };
  let y = drawHeader(doc, apartment.name, "Inventory Checklist");
  const byCategory = items.reduce<Record<string, InventoryItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});
  for (const [category, categoryItems] of Object.entries(byCategory)) {
    y = ensureSpace(doc, y, 14, apartment.name, page);
    y = sectionTitle(doc, category.replace("_", " "), y + 4);
    for (const item of categoryItems) {
      y = ensureSpace(doc, y, 10, apartment.name, page);
      y = checkboxLine(doc, `${item.name} — qty ${item.quantity}`, y);
    }
  }
  drawFooter(doc, apartment.name, page.n);
  save(doc, `${apartment.slug}-inventory-checklist.pdf`);
}

export function generateWelcomeBookPdf(
  apartment: Apartment,
  sections: GuideSection[],
  contacts: EmergencyContact[]
) {
  const doc = createDoc();
  const page = { n: 1 };

  // Cover
  doc.setFillColor("#0B0D12");
  doc.rect(0, 0, PDF_LAYOUT.PAGE_W, PDF_LAYOUT.PAGE_H, "F");
  doc.setFillColor("#4F8CFF");
  doc.rect(0, 0, PDF_LAYOUT.PAGE_W, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text("Welcome to", PDF_LAYOUT.MARGIN, 130);
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
  let y = drawHeader(doc, apartment.name, "Check-in & Check-out");
  y = labelValue(doc, "Check-in", apartment.check_in_time || "—", y);
  y = labelValue(doc, "Check-out", apartment.check_out_time || "—", y);
  if (apartment.wifi_name) {
    y = labelValue(doc, "WiFi network", apartment.wifi_name, y + 4);
    y = labelValue(doc, "WiFi password", apartment.wifi_password || "—", y);
  }

  for (const section of sections.filter((s) => s.published)) {
    y = ensureSpace(doc, y, 30, apartment.name, page);
    y = sectionTitle(doc, section.title, y + 6);
    const text = textOfSection(section);
    y = bodyText(doc, text || "—", y);
  }

  if (contacts.length > 0) {
    y = ensureSpace(doc, y, 20, apartment.name, page);
    y = sectionTitle(doc, "Emergency contacts", y + 6);
    for (const contact of contacts) {
      y = ensureSpace(doc, y, 12, apartment.name, page);
      y = labelValue(doc, contact.label, contact.phone, y);
    }
  }

  drawFooter(doc, apartment.name, page.n);
  save(doc, `${apartment.slug}-welcome-book.pdf`);
}
