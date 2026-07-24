"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, QrCode as QrCodeIcon, ScanLine } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { QrCode } from "@/types";

const QR_TARGET_LABELS: Record<string, string> = {
  apartment: "apartman",
  room: "soba",
  room_item: "stavka u sobi",
  guide_section: "sekcija vodiča",
};

const QR_OPTIONS = {
  errorCorrectionLevel: "H" as const,
  margin: 1,
  color: { dark: "#0B0D12", light: "#FFFFFF" },
  width: 320,
};

export function QrCardItem({ qr, logoUrl }: { qr: QrCode; logoUrl?: string | null }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);

  const targetUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/qr/${qr.slug}`
      : `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/qr/${qr.slug}`;

  useEffect(() => {
    QRCode.toDataURL(targetUrl, QR_OPTIONS).then(setDataUrl);
    QRCode.toString(targetUrl, { type: "svg", ...QR_OPTIONS }).then(setSvg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qr.slug]);

  function downloadPng() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${qr.slug}.png`;
    a.click();
  }

  function downloadSvg() {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${qr.slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyLink() {
    navigator.clipboard.writeText(targetUrl);
    toast.success("Link kopiran");
  }

  return (
    <Card className="overflow-hidden p-4">
      <div className="relative mx-auto mb-3 flex aspect-square w-full max-w-[180px] items-center justify-center overflow-hidden rounded-xl bg-white p-3">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt={qr.label} className="h-full w-full object-contain" />
        ) : (
          <QrCodeIcon className="size-8 animate-pulse text-secondary" />
        )}
        {logoUrl && (
          <div className="absolute flex size-9 items-center justify-center rounded-full bg-white shadow ring-4 ring-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="" className="size-6 rounded-full object-cover" />
          </div>
        )}
      </div>

      <p className="truncate text-center text-sm font-medium">{qr.label}</p>
      <div className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ScanLine className="size-3.5" /> {qr.scan_count} skeniranja
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" onClick={copyLink}>
          <Copy className="size-3.5" /> Kopiraj
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Download className="size-3.5" /> Preuzmi
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={downloadPng}>PNG</DropdownMenuItem>
            <DropdownMenuItem onClick={downloadSvg}>SVG</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Badge variant="secondary" className="mt-3 w-full justify-center capitalize">
        {QR_TARGET_LABELS[qr.target_type] ?? qr.target_type.replace("_", " ")}
      </Badge>
    </Card>
  );
}
