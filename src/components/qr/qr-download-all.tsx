"use client";

import { useState } from "react";
import QRCode from "qrcode";
import JSZip from "jszip";
import { Loader2, PackageOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import type { QrCode } from "@/types";

export function QrDownloadAll({ apartmentName, codes }: { apartmentName: string; codes: QrCode[] }) {
  const [pending, setPending] = useState(false);

  async function downloadAll() {
    if (codes.length === 0) return;
    setPending(true);
    try {
      const zip = new JSZip();
      const origin = window.location.origin;

      await Promise.all(
        codes.map(async (qr) => {
          const url = `${origin}/qr/${qr.slug}`;
          const dataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: "H",
            margin: 1,
            width: 512,
            color: { dark: "#0B0D12", light: "#FFFFFF" },
          });
          const base64 = dataUrl.split(",")[1];
          zip.file(`${slugify(qr.label)}.png`, base64, { base64: true });
        })
      );

      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${slugify(apartmentName)}-qr-codes.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="secondary" onClick={downloadAll} disabled={pending || codes.length === 0}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <PackageOpen className="size-4" />}
      Download all (ZIP)
    </Button>
  );
}
