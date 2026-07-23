"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { inventoryItemSchema } from "@/lib/validations";
import type { InventoryCategory } from "@/types";

export type FormState = { error?: string } | undefined;

function parseInventoryForm(formData: FormData) {
  return inventoryItemSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    quantity: formData.get("quantity"),
    min_quantity: formData.get("min_quantity"),
    location: formData.get("location"),
    notes: formData.get("notes"),
    photo_url: formData.get("photo_url"),
  });
}

export async function createInventoryItem(apartmentId: string, slug: string, _prev: FormState, formData: FormData) {
  const parsed = parseInventoryForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { supabase } = await requireUser();
  const status = parsed.data.quantity < parsed.data.min_quantity ? "low" : "ok";

  const { error } = await supabase.from("inventory_items").insert({
    apartment_id: apartmentId,
    name: parsed.data.name,
    category: parsed.data.category as InventoryCategory,
    quantity: parsed.data.quantity,
    min_quantity: parsed.data.min_quantity,
    location: parsed.data.location || null,
    notes: parsed.data.notes || null,
    photo_url: parsed.data.photo_url || null,
    status,
  });

  if (error) return { error: error.message };

  revalidatePath(`/apartments/${slug}/inventory`);
  return {};
}

export async function updateInventoryItem(itemId: string, slug: string, _prev: FormState, formData: FormData) {
  const parsed = parseInventoryForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { supabase } = await requireUser();
  const status = parsed.data.quantity < parsed.data.min_quantity ? "low" : "ok";

  const { error } = await supabase
    .from("inventory_items")
    .update({
      name: parsed.data.name,
      category: parsed.data.category as InventoryCategory,
      quantity: parsed.data.quantity,
      min_quantity: parsed.data.min_quantity,
      location: parsed.data.location || null,
      notes: parsed.data.notes || null,
      photo_url: parsed.data.photo_url || null,
      status,
    })
    .eq("id", itemId);

  if (error) return { error: error.message };

  revalidatePath(`/apartments/${slug}/inventory`);
  return {};
}

export async function deleteInventoryItem(itemId: string, slug: string) {
  const { supabase } = await requireUser();
  await supabase.from("inventory_items").delete().eq("id", itemId);
  revalidatePath(`/apartments/${slug}/inventory`);
}

export async function resolveInventoryItem(itemId: string, slug: string) {
  const { supabase } = await requireUser();
  await supabase.from("inventory_items").update({ status: "ok" }).eq("id", itemId);
  revalidatePath(`/apartments/${slug}/inventory`);
}

export async function reportInventoryIssue(
  itemId: string,
  type: "missing" | "broken" | "needs_replacement",
  reportedBy: string
) {
  // Public action used from the no-login cleaner report page — RLS allows
  // anonymous inserts, and a DB trigger syncs the item status.
  const supabase = await createClient();
  await supabase.from("inventory_reports").insert({ item_id: itemId, type, reported_by: reportedBy || "Cleaner" });
}
