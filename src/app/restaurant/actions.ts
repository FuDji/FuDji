"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { menuItemSchema } from "@/lib/validations";

export type ActionState = { error?: string; success?: boolean } | undefined;

export async function acceptOrder(orderId: string, prepTimeMinutes: number): Promise<ActionState> {
  const { supabase, profile } = await requireRole("restaurant_staff");
  if (!profile.restaurant_id) return { error: "Nalog nije povezan ni sa jednim restoranom." };

  const { error } = await supabase
    .from("orders")
    .update({ status: "accepted", prep_time_minutes: prepTimeMinutes, rejection_reason: null })
    .eq("id", orderId)
    .eq("restaurant_id", profile.restaurant_id);

  if (error) return { error: "Narudžbina nije mogla biti prihvaćena." };
  revalidatePath("/restaurant");
  return { success: true };
}

export async function rejectOrder(orderId: string, reason: string): Promise<ActionState> {
  const { supabase, profile } = await requireRole("restaurant_staff");
  if (!reason.trim()) return { error: "Razlog odbijanja je obavezan." };
  if (!profile.restaurant_id) return { error: "Nalog nije povezan ni sa jednim restoranom." };

  const { error } = await supabase
    .from("orders")
    .update({ status: "rejected", rejection_reason: reason })
    .eq("id", orderId)
    .eq("restaurant_id", profile.restaurant_id);

  if (error) return { error: "Narudžbina nije mogla biti odbijena." };
  revalidatePath("/restaurant");
  return { success: true };
}

export async function setOrderStatus(
  orderId: string,
  status: "preparing" | "ready" | "picked_up"
): Promise<ActionState> {
  const { supabase, profile } = await requireRole("restaurant_staff");
  if (!profile.restaurant_id) return { error: "Nalog nije povezan ni sa jednim restoranom." };

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .eq("restaurant_id", profile.restaurant_id);

  if (error) return { error: "Status nije mogao biti sačuvan." };
  revalidatePath("/restaurant");
  return { success: true };
}

export async function upsertMenuItem(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase, profile } = await requireRole("restaurant_staff");
  if (!profile.restaurant_id) return { error: "Nalog nije povezan ni sa jednim restoranom." };
  const id = formData.get("id") as string | null;

  const parsed = menuItemSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    image_url: formData.get("image_url"),
    calories: formData.get("calories") || null,
    price: formData.get("price"),
    category: formData.get("category"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Neispravan unos" };

  if (id) {
    const { error } = await supabase
      .from("menu_items")
      .update({ ...parsed.data, image_url: parsed.data.image_url || null })
      .eq("id", id)
      .eq("restaurant_id", profile.restaurant_id);
    if (error) return { error: "Jelo nije moglo biti sačuvano." };
  } else {
    const { error } = await supabase.from("menu_items").insert({
      ...parsed.data,
      image_url: parsed.data.image_url || null,
      restaurant_id: profile.restaurant_id,
    });
    if (error) return { error: "Jelo nije moglo biti sačuvano." };
  }

  revalidatePath("/restaurant/menu");
  return { success: true };
}

export async function toggleMenuItemActive(itemId: string, active: boolean): Promise<ActionState> {
  const { supabase, profile } = await requireRole("restaurant_staff");
  if (!profile.restaurant_id) return { error: "Nalog nije povezan ni sa jednim restoranom." };

  const { error } = await supabase
    .from("menu_items")
    .update({ active })
    .eq("id", itemId)
    .eq("restaurant_id", profile.restaurant_id);
  if (error) return { error: "Status nije mogao biti sačuvan." };

  revalidatePath("/restaurant/menu");
  return { success: true };
}

export async function setDailyAvailability(
  menuItemId: string,
  date: string,
  isAvailable: boolean,
  isDealOfDay: boolean,
  dealLabel: string,
  dealPrice: number | null
): Promise<ActionState> {
  const { supabase, profile } = await requireRole("restaurant_staff");
  if (!profile.restaurant_id) return { error: "Nalog nije povezan ni sa jednim restoranom." };

  const { error } = await supabase.from("daily_menu").upsert(
    {
      restaurant_id: profile.restaurant_id,
      menu_item_id: menuItemId,
      date,
      is_available: isAvailable,
      is_deal_of_day: isDealOfDay,
      deal_label: dealLabel || null,
      deal_price: dealPrice,
    },
    { onConflict: "restaurant_id,menu_item_id,date" }
  );

  if (error) return { error: "Dostupnost nije mogla biti sačuvana." };
  revalidatePath("/restaurant/menu");
  return { success: true };
}

export async function setDailyCapacity(date: string, isOpen: boolean, mealLimit: number): Promise<ActionState> {
  const { supabase, profile } = await requireRole("restaurant_staff");
  if (!profile.restaurant_id) return { error: "Nalog nije povezan ni sa jednim restoranom." };

  const { error } = await supabase.from("restaurant_schedule").upsert(
    { restaurant_id: profile.restaurant_id, date, is_open: isOpen, meal_limit: mealLimit },
    { onConflict: "restaurant_id,date" }
  );

  if (error) return { error: "Kapacitet nije mogao biti sačuvan." };
  revalidatePath("/restaurant/capacity");
  return { success: true };
}
