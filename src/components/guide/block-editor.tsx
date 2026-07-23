"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Image as ImageIcon,
  Link2,
  Loader2,
  Map as MapIcon,
  MousePointerClick,
  Plus,
  Text as TextIcon,
  Trash2,
  Video,
  FileText,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/layout/empty-state";
import { updateGuideSectionBlocks, updateGuideSectionMeta } from "@/app/apartments/[slug]/guide/actions";
import type { GuideBlock } from "@/types/database";
import type { GuideSection } from "@/types";

const BLOCK_TYPES: { type: GuideBlock["type"]; label: string; icon: typeof TextIcon }[] = [
  { type: "text", label: "Text", icon: TextIcon },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "video", label: "Video", icon: Video },
  { type: "pdf", label: "PDF", icon: FileText },
  { type: "link", label: "Link", icon: Link2 },
  { type: "button", label: "Button", icon: MousePointerClick },
  { type: "map", label: "Map", icon: MapIcon },
];

function newBlock(type: GuideBlock["type"]): GuideBlock {
  return { id: crypto.randomUUID(), type };
}

export function BlockEditor({ slug, section }: { slug: string; section: GuideSection }) {
  const [title, setTitle] = useState(section.title);
  const [published, setPublished] = useState(section.published);
  const [blocks, setBlocks] = useState<GuideBlock[]>(section.blocks ?? []);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function addBlock(type: GuideBlock["type"]) {
    setBlocks((prev) => [...prev, newBlock(type)]);
  }

  function updateBlock(id: string, patch: Partial<GuideBlock>) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setBlocks((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function save() {
    startTransition(async () => {
      await updateGuideSectionMeta(section.id, slug, { title, icon: section.icon ?? "Sparkles", published });
      await updateGuideSectionBlocks(section.id, slug, blocks);
      toast.success("Section saved");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/apartments/${slug}/guide`)}>
          <ArrowLeft className="size-4" />
        </Button>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-sm text-base font-medium"
        />
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch checked={published} onCheckedChange={setPublished} id="published" />
            <Label htmlFor="published" className="text-sm text-muted-foreground">
              Published
            </Label>
          </div>
          <Button onClick={save} disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Save
          </Button>
        </div>
      </div>

      {blocks.length === 0 ? (
        <EmptyState
          icon={TextIcon}
          title="This section is empty"
          description="Add text, images, videos, links, buttons or a map to build this page."
        />
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <BlockCard
              key={block.id}
              block={block}
              index={index}
              total={blocks.length}
              onChange={(patch) => updateBlock(block.id, patch)}
              onRemove={() => removeBlock(block.id)}
              onMove={(dir) => moveBlock(index, dir)}
            />
          ))}
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <Plus className="size-4" /> Add block
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {BLOCK_TYPES.map((bt) => (
            <DropdownMenuItem key={bt.type} onClick={() => addBlock(bt.type)}>
              <bt.icon /> {bt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function BlockCard({
  block,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  block: GuideBlock;
  index: number;
  total: number;
  onChange: (patch: Partial<GuideBlock>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const meta = BLOCK_TYPES.find((b) => b.type === block.type)!;

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <meta.icon className="size-4" /> {meta.label}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => onMove(-1)} disabled={index === 0}>
            <ArrowUp className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onMove(1)} disabled={index === total - 1}>
            <ArrowDown className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onRemove}>
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        </div>
      </div>
      <CardContent className="p-0">
        {block.type === "text" && (
          <Textarea
            placeholder="Write something helpful for your guests…"
            value={block.content ?? ""}
            onChange={(e) => onChange({ content: e.target.value })}
            rows={4}
          />
        )}
        {(block.type === "image" || block.type === "video" || block.type === "pdf") && (
          <Input
            placeholder={`${meta.label} URL`}
            value={block.url ?? ""}
            onChange={(e) => onChange({ url: e.target.value })}
          />
        )}
        {block.type === "link" && (
          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              placeholder="Label"
              value={block.label ?? ""}
              onChange={(e) => onChange({ label: e.target.value })}
            />
            <Input
              placeholder="https://…"
              value={block.url ?? ""}
              onChange={(e) => onChange({ url: e.target.value })}
            />
          </div>
        )}
        {block.type === "button" && (
          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              placeholder="Button text"
              value={block.label ?? ""}
              onChange={(e) => onChange({ label: e.target.value })}
            />
            <Input
              placeholder="https://…"
              value={block.url ?? ""}
              onChange={(e) => onChange({ url: e.target.value })}
            />
          </div>
        )}
        {block.type === "map" && (
          <div className="grid gap-2 sm:grid-cols-3">
            <Input
              placeholder="Address / label"
              value={block.label ?? ""}
              onChange={(e) => onChange({ label: e.target.value })}
              className="sm:col-span-1"
            />
            <Input
              type="number"
              step="any"
              placeholder="Latitude"
              value={block.lat ?? ""}
              onChange={(e) => onChange({ lat: e.target.value ? Number(e.target.value) : undefined })}
            />
            <Input
              type="number"
              step="any"
              placeholder="Longitude"
              value={block.lng ?? ""}
              onChange={(e) => onChange({ lng: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
