import { BlockRenderer } from "@/components/guest/block-renderer";
import { DynamicIcon } from "@/lib/icon-map";
import type { GuideSection } from "@/types";

export function SectionCard({ section }: { section: GuideSection }) {
  return (
    <section id={section.key} className="scroll-mt-20 rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <DynamicIcon name={section.icon} className="size-5" />
        </div>
        <h2 className="text-lg font-semibold">{section.title}</h2>
      </div>
      <div className="space-y-4">
        {section.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
        {section.blocks.length === 0 && (
          <p className="text-sm text-muted-foreground">Nothing here yet.</p>
        )}
      </div>
    </section>
  );
}
