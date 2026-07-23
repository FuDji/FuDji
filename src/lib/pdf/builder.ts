import { jsPDF } from "jspdf";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const ACCENT = "#4F8CFF";
const INK = "#0B0D12";
const MUTED = "#64748B";

export function createDoc() {
  return new jsPDF({ unit: "mm", format: "a4" });
}

export function drawHeader(doc: jsPDF, apartmentName: string, title: string) {
  doc.setFillColor(ACCENT);
  doc.rect(0, 0, PAGE_W, 6, "F");

  doc.setTextColor(MUTED);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(apartmentName.toUpperCase(), MARGIN, 20);

  doc.setTextColor(INK);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(title, MARGIN, 32);

  doc.setDrawColor(230, 230, 235);
  doc.line(MARGIN, 38, PAGE_W - MARGIN, 38);

  return 48;
}

export function drawFooter(doc: jsPDF, apartmentName: string, page: number) {
  doc.setFontSize(8);
  doc.setTextColor(MUTED);
  doc.setFont("helvetica", "normal");
  doc.text(`${apartmentName} · Generated with FuDji`, MARGIN, PAGE_H - 10);
  doc.text(String(page), PAGE_W - MARGIN, PAGE_H - 10, { align: "right" });
}

export function sectionTitle(doc: jsPDF, text: string, y: number) {
  doc.setTextColor(INK);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(text, MARGIN, y);
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

export function checkboxLine(doc: jsPDF, text: string, y: number) {
  doc.setDrawColor(180, 180, 190);
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
