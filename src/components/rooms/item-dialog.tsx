"use client";

import { useState, useTransition } from "react";
import { Plus, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createRoomItem, updateRoomItem } from "@/app/apartments/[slug]/rooms/actions";
import type { RoomItem } from "@/types";
import type { FaqEntry } from "@/types/database";

export function ItemDialog({
  apartmentId,
  roomId,
  slug,
  item,
  trigger,
}: {
  apartmentId: string;
  roomId: string;
  slug: string;
  item?: RoomItem;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(item?.name ?? "");
  const [instructions, setInstructions] = useState(item?.instructions ?? "");
  const [videoUrl, setVideoUrl] = useState(item?.video_url ?? "");
  const [warnings, setWarnings] = useState(item?.warnings ?? "");
  const [tips, setTips] = useState(item?.tips ?? "");
  const [images, setImages] = useState((item?.images ?? []).join("\n"));
  const [faqs, setFaqs] = useState<FaqEntry[]>(item?.faqs ?? []);
  const [pending, startTransition] = useTransition();

  function addFaq() {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  }

  function updateFaq(index: number, patch: Partial<FaqEntry>) {
    setFaqs((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function removeFaq(index: number) {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  }

  function save() {
    if (!name.trim()) return;
    const payload = {
      name,
      icon: item?.icon ?? "Wrench",
      instructions,
      video_url: videoUrl,
      warnings,
      tips,
      images: images.split("\n").map((s) => s.trim()).filter(Boolean),
      faqs: faqs.filter((f) => f.question.trim()),
    };

    startTransition(async () => {
      if (item) {
        await updateRoomItem(item.id, roomId, slug, payload);
      } else {
        await createRoomItem(apartmentId, roomId, slug, payload);
      }
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Edit item" : "Add item"}</DialogTitle>
          <DialogDescription>Give guests everything they need to use it confidently.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="item-name">Name</Label>
            <Input id="item-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Coffee Machine" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="item-instructions">Instructions</Label>
            <Textarea
              id="item-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="Step-by-step how to use it…"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="item-video">Video URL</Label>
              <Input id="item-video" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="item-images">Image URLs (one per line)</Label>
              <Input id="item-images" value={images} onChange={(e) => setImages(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="item-warnings">Warnings</Label>
              <Textarea id="item-warnings" value={warnings} onChange={(e) => setWarnings(e.target.value)} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="item-tips">Tips</Label>
              <Textarea id="item-tips" value={tips} onChange={(e) => setTips(e.target.value)} rows={2} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>FAQs</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addFaq}>
                <Plus className="size-3.5" /> Add FAQ
              </Button>
            </div>
            {faqs.map((faq, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg border border-border p-2.5">
                <div className="flex-1 space-y-1.5">
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => updateFaq(i, { question: e.target.value })}
                  />
                  <Input
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => updateFaq(i, { answer: e.target.value })}
                  />
                </div>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeFaq(i)}>
                  <X className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={pending || !name.trim()}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Save item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
