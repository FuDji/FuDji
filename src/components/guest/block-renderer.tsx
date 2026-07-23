import Image from "next/image";
import { ExternalLink, FileText, MapPin } from "lucide-react";

import type { GuideBlock } from "@/types/database";

function getEmbedUrl(url: string) {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export function BlockRenderer({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "text":
      return (
        <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">{block.content}</p>
      );

    case "image":
      return block.url ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-secondary">
          <Image src={block.url} alt="" fill className="object-cover" unoptimized />
        </div>
      ) : null;

    case "video": {
      if (!block.url) return null;
      const embed = getEmbedUrl(block.url);
      return (
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-secondary">
          {embed ? (
            <iframe src={embed} className="h-full w-full" allowFullScreen />
          ) : (
            <video src={block.url} controls className="h-full w-full object-cover" />
          )}
        </div>
      );
    }

    case "pdf":
      return block.url ? (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5"
        >
          <FileText className="size-5 text-primary" />
          <span className="flex-1 text-sm font-medium">View PDF document</span>
          <ExternalLink className="size-4 text-muted-foreground" />
        </a>
      ) : null;

    case "link":
      return block.url ? (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {block.label || block.url}
          <ExternalLink className="size-3.5" />
        </a>
      ) : null;

    case "button":
      return block.url ? (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          {block.label || "Open"}
        </a>
      ) : null;

    case "map": {
      const query = block.lat && block.lng ? `${block.lat},${block.lng}` : block.label;
      if (!query) return null;
      return (
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(String(query))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5"
        >
          <MapPin className="size-5 text-primary" />
          <span className="flex-1 text-sm font-medium">{block.label || "Open location in Maps"}</span>
          <ExternalLink className="size-4 text-muted-foreground" />
        </a>
      );
    }

    default:
      return null;
  }
}
