import Link from "next/link";
import { CalendarDays, User } from "lucide-react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/layout/empty-state";
import { PriorityBadge } from "@/components/maintenance/badges";
import { DynamicIcon } from "@/lib/icon-map";
import { MAINTENANCE_CATEGORIES, MAINTENANCE_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Wrench } from "lucide-react";
import type { MaintenanceIssue } from "@/types";

export function IssueBoard({ slug, issues }: { slug: string; issues: MaintenanceIssue[] }) {
  if (issues.length === 0) {
    return (
      <EmptyState icon={Wrench} title="Nema prijavljenih kvarova" description="Odlično — trenutno nema ničega za popravku." />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {MAINTENANCE_STATUSES.map((status) => {
        const columnIssues = issues.filter((i) => i.status === status.value);
        return (
          <div key={status.value}>
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-sm font-medium text-muted-foreground">{status.label}</h3>
              <span className="text-xs text-muted-foreground">{columnIssues.length}</span>
            </div>
            <div className="space-y-2">
              {columnIssues.map((issue) => {
                const categoryMeta = MAINTENANCE_CATEGORIES.find((c) => c.value === issue.category);
                return (
                  <Link key={issue.id} href={`/apartments/${slug}/maintenance/${issue.id}`}>
                    <Card className="p-3.5 transition-colors hover:border-primary/40">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <DynamicIcon name={categoryMeta?.icon} className="size-3.5" />
                          {categoryMeta?.label}
                        </div>
                        <PriorityBadge priority={issue.priority} />
                      </div>
                      <p className="text-sm font-medium leading-snug">{issue.title}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        {issue.assigned_to ? (
                          <span className="flex items-center gap-1">
                            <User className="size-3" /> {issue.assigned_to}
                          </span>
                        ) : (
                          <span />
                        )}
                        {issue.due_date && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="size-3" /> {formatDate(issue.due_date)}
                          </span>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
              {columnIssues.length === 0 && (
                <div className="rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                  Prazno
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
