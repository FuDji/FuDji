"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/lib/icon-map";
import {
  deleteGuideSection,
  reorderGuideSections,
  updateGuideSectionMeta,
} from "@/app/apartments/[slug]/guide/actions";
import type { GuideSection } from "@/types";

export function SectionList({ slug, sections }: { slug: string; sections: GuideSection[] }) {
  const [items, setItems] = useOptimistic(sections);
  const [, startTransition] = useTransition();

  function move(index: number, direction: -1 | 1) {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];

    startTransition(async () => {
      setOptimistic(next);
      await reorderGuideSections(
        slug,
        next.map((s) => s.id)
      );
    });
  }

  function setOptimistic(next: GuideSection[]) {
    setItems(next);
  }

  function togglePublish(section: GuideSection) {
    startTransition(async () => {
      setOptimistic(
        items.map((s) => (s.id === section.id ? { ...s, published: !s.published } : s))
      );
      await updateGuideSectionMeta(section.id, slug, {
        title: section.title,
        icon: section.icon ?? "Sparkles",
        published: !section.published,
      });
    });
  }

  function remove(section: GuideSection) {
    startTransition(async () => {
      setOptimistic(items.filter((s) => s.id !== section.id));
      await deleteGuideSection(section.id, slug);
      toast.success(`"${section.title}" obrisano`);
    });
  }

  return (
    <div className="space-y-2">
      {items.map((section, index) => (
        <Card key={section.id} className="flex-row items-center gap-3 p-3 pl-4">
          <GripVertical className="size-4 shrink-0 text-muted-foreground/50" />
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <DynamicIcon name={section.icon} className="size-4" />
          </div>
          <Link href={`/apartments/${slug}/guide/${section.id}`} className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{section.title}</p>
            <p className="text-xs text-muted-foreground">
              {section.blocks?.length ?? 0} blok(ova) · {section.view_count} pregleda
            </p>
          </Link>
          <Badge variant={section.published ? "success" : "secondary"}>
            {section.published ? "Objavljeno" : "Nacrt"}
          </Badge>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => move(index, -1)} disabled={index === 0}>
              <ArrowUp className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
            >
              <ArrowDown className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => togglePublish(section)}>
              {section.published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => remove(section)}>
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
