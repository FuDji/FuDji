"use client";

import { DynamicIcon } from "@/lib/icon-map";
import type { GuideSection } from "@/types";

export function SectionNav({ sections }: { sections: GuideSection[] }) {
  if (sections.length === 0) return null;

  return (
    <div className="no-scrollbar sticky top-0 z-20 -mx-4 overflow-x-auto border-b border-border bg-background/90 px-4 py-3 backdrop-blur-xl">
      <div className="flex gap-2">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.key}`}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors active:bg-secondary"
          >
            <DynamicIcon name={section.icon} className="size-3.5" />
            {section.title}
          </a>
        ))}
      </div>
    </div>
  );
}
