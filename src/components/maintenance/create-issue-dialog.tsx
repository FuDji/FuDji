"use client";

import { useActionState, useEffect, useState } from "react";
import { AlertCircle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from "@/components/auth/submit-button";
import { MAINTENANCE_CATEGORIES, MAINTENANCE_PRIORITIES } from "@/lib/constants";
import { createMaintenanceIssue, type FormState } from "@/app/apartments/[slug]/maintenance/actions";
import type { Room } from "@/types";

export function CreateIssueDialog({
  apartmentId,
  slug,
  rooms,
}: {
  apartmentId: string;
  slug: string;
  rooms: Room[];
}) {
  const [open, setOpen] = useState(false);
  const action = createMaintenanceIssue.bind(null, apartmentId, slug);
  const [state, formAction] = useActionState<FormState, FormData>(action, undefined);

  useEffect(() => {
    if (state && !state.error) setOpen(false);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" /> Add Maintenance
      </Button>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report a maintenance issue</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="issue-title">Title</Label>
            <Input id="issue-title" name="title" placeholder="Leaking kitchen faucet" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="issue-description">Description</Label>
            <Textarea id="issue-description" name="description" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="issue-category">Category</Label>
              <Select name="category" defaultValue="other">
                <SelectTrigger id="issue-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MAINTENANCE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="issue-priority">Priority</Label>
              <Select name="priority" defaultValue="medium">
                <SelectTrigger id="issue-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MAINTENANCE_PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="issue-room">Room</Label>
              <Select name="room_id">
                <SelectTrigger id="issue-room">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="issue-due">Due date</Label>
              <Input id="issue-due" name="due_date" type="date" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="issue-assignee">Assign to</Label>
              <Input id="issue-assignee" name="assigned_to" placeholder="Name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="issue-photo">Photo URL</Label>
              <Input id="issue-photo" name="photo_url" />
            </div>
          </div>

          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {state.error}
            </div>
          )}

          <SubmitButton>Create issue</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
