"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, CalendarDays, Loader2, MessageSquare, Trash2, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PriorityBadge, StatusBadge } from "@/components/maintenance/badges";
import { DynamicIcon } from "@/lib/icon-map";
import { MAINTENANCE_CATEGORIES, MAINTENANCE_STATUSES } from "@/lib/constants";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import {
  addMaintenanceComment,
  deleteMaintenanceIssue,
  updateMaintenanceStatus,
} from "@/app/apartments/[slug]/maintenance/actions";
import type { MaintenanceIssue, MaintenanceEvent, MaintenanceStatus } from "@/types";

export function IssueDetail({
  slug,
  issue,
  events,
}: {
  slug: string;
  issue: MaintenanceIssue;
  events: MaintenanceEvent[];
}) {
  const [comment, setComment] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const categoryMeta = MAINTENANCE_CATEGORIES.find((c) => c.value === issue.category);

  function setStatus(status: MaintenanceStatus) {
    startTransition(async () => {
      await updateMaintenanceStatus(issue.id, slug, status);
      router.refresh();
    });
  }

  function submitComment() {
    if (!comment.trim()) return;
    startTransition(async () => {
      await addMaintenanceComment(issue.id, slug, comment);
      setComment("");
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await deleteMaintenanceIssue(issue.id, slug);
      router.push(`/apartments/${slug}/maintenance`);
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/apartments/${slug}/maintenance`)}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-semibold">{issue.title}</h1>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={remove} disabled={pending}>
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <PriorityBadge priority={issue.priority} />
              <StatusBadge status={issue.status} />
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <DynamicIcon name={categoryMeta?.icon} className="size-3.5" /> {categoryMeta?.label}
              </span>
              {issue.due_date && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" /> Rok {formatDate(issue.due_date)}
                </span>
              )}
              {issue.assigned_to && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="size-3.5" /> {issue.assigned_to}
                </span>
              )}
            </div>
            {issue.description && <p className="text-sm text-foreground/90">{issue.description}</p>}
            {issue.photo_url && (
              <div className="relative mt-4 h-56 w-full overflow-hidden rounded-xl bg-secondary">
                <Image src={issue.photo_url} alt={issue.title} fill className="object-cover" unoptimized />
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Istorija</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              {events.map((event) => (
                <div key={event.id} className="flex gap-3">
                  <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MessageSquare className="size-3" />
                  </div>
                  <div>
                    <p className="text-sm">{event.note}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(event.created_at)}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Textarea
                  placeholder="Dodaj komentar…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                />
                <Button onClick={submitComment} disabled={pending || !comment.trim()}>
                  {pending && <Loader2 className="size-4 animate-spin" />}
                  Objavi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit p-5">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">Promeni status</h3>
          <div className="space-y-2">
            {MAINTENANCE_STATUSES.map((status) => (
              <Button
                key={status.value}
                variant={issue.status === status.value ? "default" : "secondary"}
                className="w-full justify-start"
                onClick={() => setStatus(status.value)}
                disabled={pending}
              >
                {status.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
