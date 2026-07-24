import { jsPDF } from "jspdf";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const DEFAULT_ACCENT = "#4F8CFF";
const INK = "#0B0D12";
const MUTED = "#64748B";

export function createDoc() {
  return new jsPDF({ unit: "mm", format: "a4" });
}

export async function loadImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export function drawHeader(
  doc: jsPDF,
  apartmentName: string,
  title: string,
  opts?: { accentColor?: string; logoDataUrl?: string | null }
) {
  const accentColor = opts?.accentColor ?? DEFAULT_ACCENT;

  doc.setFillColor(accentColor);
  doc.rect(0, 0, PAGE_W, 6, "F");

  if (opts?.logoDataUrl) {
    // ~32px at 96dpi
    const logoSize = 8.5;
    try {
      doc.addImage(opts.logoDataUrl, (PAGE_W - logoSize) / 2, 10, logoSize, logoSize, undefined, "FAST");
    } catch {
      // ignore malformed/unsupported image data — header still renders without it
    }
  }

  doc.setTextColor(MUTED);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(apartmentName.toUpperCase(), MARGIN, opts?.logoDataUrl ? 28 : 20, { align: "left" });

  doc.setTextColor(INK);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(title, MARGIN, opts?.logoDataUrl ? 40 : 32);

  doc.setDrawColor(230, 230, 235);
  doc.line(MARGIN, opts?.logoDataUrl ? 46 : 38, PAGE_W - MARGIN, opts?.logoDataUrl ? 46 : 38);

  return opts?.logoDataUrl ? 56 : 48;
}

export function drawFooter(doc: jsPDF, apartmentName: string, page: number) {
  doc.setFontSize(8);
  doc.setTextColor(MUTED);
  doc.setFont("helvetica", "normal");
  doc.text(`${apartmentName} · Generisano uz Boravak`, MARGIN, PAGE_H - 10);
  doc.text(String(page), PAGE_W - MARGIN, PAGE_H - 10, { align: "right" });
}

export function sectionTitle(doc: jsPDF, text: string, y: number, accentColor?: string) {
  doc.setTextColor(INK);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(text, MARGIN, y);
  if (accentColor) {
    doc.setDrawColor(accentColor);
    doc.setLineWidth(0.8);
    doc.line(MARGIN, y + 1.5, MARGIN + 10, y + 1.5);
    doc.setLineWidth(0.2);
  }
  return y + 7;
}

export function bodyText(doc: jsPDF, text: string, y: number, opts?: { maxWidth?: number }) {
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(text, opts?.maxWidth ?? PAGE_W - MARGIN * 2);
  doc.text(lines, MARGIN, y);
  return y + lines.length * 5 + 4;
}

export function labelValue(doc: jsPDF, label: string, value: string, y: number) {
  doc.setTextColor(MUTED);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(label.toUpperCase(), MARGIN, y);
  doc.setTextColor(INK);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(value, MARGIN, y + 6);
  return y + 14;
}

export function checkboxLine(doc: jsPDF, text: string, y: number, accentColor?: string) {
  doc.setDrawColor(accentColor ?? "#B4B4BE");
  doc.rect(MARGIN, y - 4, 4.5, 4.5);
  doc.setTextColor(30, 30, 40);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "normal");
  doc.text(text, MARGIN + 8, y);
  return y + 8;
}

export function ensureSpace(doc: jsPDF, y: number, needed: number, apartmentName: string, page: { n: number }) {
  if (y + needed > PAGE_H - 20) {
    drawFooter(doc, apartmentName, page.n);
    doc.addPage();
    page.n += 1;
    return 24;
  }
  return y;
}

export const PDF_LAYOUT = { PAGE_W, PAGE_H, MARGIN };
export { DEFAULT_ACCENT };
