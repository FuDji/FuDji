"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { computeOrderSplit, canEditOrder } from "@/lib/orders";
import { isPastCutoff } from "@/lib/utils";
import type { DailyMenu, MenuItem } from "@/types";

export type ActionState = { error?: string; success?: boolean } | undefined;

type CartLine = { menuItemId: string; quantity: number; note?: string };

export async function placeOrder(
  date: string,
  restaurantId: string,
  items: CartLine[],
  note: string
): Promise<ActionState> {
  const { supabase, user, profile } = await requireRole("employee");

  if (!profile.company_id) return { error: "Nalog nije povezan ni sa jednom firmom." };
  if (items.length === 0) return { error: "Dodaj bar jedno jelo u narudžbinu." };

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", profile.company_id)
    .single();
  if (!company) return { error: "Firma nije pronađena." };
  if (company.status !== "active") return { error: "Firma trenutno nije aktivna." };

  if (isPastCutoff(date, company.cutoff_time)) {
    return { error: `Rok za naručivanje (${company.cutoff_time}) za taj dan je prošao.` };
  }

  const { data: schedule } = await supabase
    .from("restaurant_schedule")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("date", date)
    .maybeSingle();
  if (!schedule || !schedule.is_open) {
    return { error: "Ovaj restoran ne radi na izabrani dan." };
  }

  const { data: existing } = await supabase
    .from("orders")
    .select("id, restaurant_id, status, locked")
    .eq("employee_id", user.id)
    .eq("order_date", date)
    .maybeSingle();

  if (existing && !canEditOrder(existing.status, existing.locked)) {
    return { error: "Ova narudžbina se više ne može menjati." };
  }

  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId)
    .eq("order_date", date)
    .neq("status", "rejected");
  const currentCount = count ?? 0;
  const isNewOrderForRestaurant = !existing || existing.restaurant_id !== restaurantId;
  if (isNewOrderForRestaurant && currentCount >= schedule.meal_limit) {
    return { error: "Restoran je dostigao dnevni limit obroka za taj dan." };
  }

  const menuItemIds = items.map((i) => i.menuItemId);
  const { data: dailyRows } = await supabase
    .from("daily_menu")
    .select("*, menu_item:menu_items(*)")
    .eq("restaurant_id", restaurantId)
    .eq("date", date)
    .in("menu_item_id", menuItemIds)
    .returns<(DailyMenu & { menu_item: MenuItem })[]>();

  if (!dailyRows || dailyRows.length !== menuItemIds.length) {
    return { error: "Jedno ili više jela više nije dostupno za taj dan." };
  }

  type Row = (typeof dailyRows)[number];
  const byItemId = new Map<string, Row>(dailyRows.map((r) => [r.menu_item_id, r]));

  let subtotal = 0;
  const orderItemRows = items.map((line) => {
    const row = byItemId.get(line.menuItemId)!;
    if (!row.is_available) throw new Error(`${row.menu_item.name} više nije dostupno.`);
    const price = row.is_deal_of_day && row.deal_price != null ? row.deal_price : row.menu_item.price;
    subtotal += price * line.quantity;
    return {
      menu_item_id: line.menuItemId,
      name_snapshot: row.menu_item.name,
      price_snapshot: price,
      calories_snapshot: row.menu_item.calories,
      quantity: line.quantity,
      note: line.note || null,
    };
  });

  const budget = profile.daily_budget_override ?? company.daily_budget;
  const split = computeOrderSplit(company.payment_type, subtotal, budget, company.mixed_cap);
  if (split.exceedsBudget) {
    return {
      error: `Narudžbina (${subtotal} RSD) prelazi tvoj dnevni budžet (${budget} RSD).`,
    };
  }

  let orderId = existing?.id;
  if (orderId) {
    await supabase
      .from("orders")
      .update({
        restaurant_id: restaurantId,
        status: "pending",
        rejection_reason: null,
        prep_time_minutes: null,
        note: note || null,
        subtotal,
        company_covered: split.companyCovered,
        employee_paid: split.employeePaid,
        employee_name_snapshot: profile.full_name,
      })
      .eq("id", orderId);
    await supabase.from("order_items").delete().eq("order_id", orderId);
  } else {
    const { data: created, error: createError } = await supabase
      .from("orders")
      .insert({
        company_id: profile.company_id,
        employee_id: user.id,
        employee_name_snapshot: profile.full_name,
        restaurant_id: restaurantId,
        order_date: date,
        note: note || null,
        subtotal,
        company_covered: split.companyCovered,
        employee_paid: split.employeePaid,
      })
      .select("id")
      .single();
    if (createError || !created) return { error: "Narudžbina nije mogla biti kreirana." };
    orderId = created.id;
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemRows.map((r) => ({ ...r, order_id: orderId })));
  if (itemsError) return { error: "Stavke narudžbine nisu mogle biti sačuvane." };

  revalidatePath("/app");
  revalidatePath("/app/menu");
  revalidatePath("/app/orders");
  return { success: true };
}

export async function cancelOrder(orderId: string): Promise<ActionState> {
  const { supabase, user } = await requireRole("employee");

  const { data: order } = await supabase
    .from("orders")
    .select("id, employee_id, status, locked")
    .eq("id", orderId)
    .single();

  if (!order || order.employee_id !== user.id) return { error: "Narudžbina nije pronađena." };
  if (!canEditOrder(order.status, order.locked)) {
    return { error: "Ova narudžbina se više ne može otkazati." };
  }

  await supabase.from("orders").delete().eq("id", orderId);
  revalidatePath("/app");
  revalidatePath("/app/menu");
  revalidatePath("/app/orders");
  return { success: true };
}

export async function submitRating(
  orderId: string,
  deliveryRating: number,
  foodRating: number,
  systemRating: number,
  comment: string
): Promise<ActionState> {
  const { supabase, user } = await requireRole("employee");

  const { error } = await supabase.from("ratings").insert({
    order_id: orderId,
    employee_id: user.id,
    delivery_rating: deliveryRating,
    food_rating: foodRating,
    system_rating: systemRating,
    comment: comment || null,
  });
  if (error) return { error: "Ocena nije mogla biti sačuvana." };

  revalidatePath("/app/orders");
  return { success: true };
}

export async function redeemReward(rewardId: string): Promise<ActionState> {
  const { supabase, user, profile } = await requireRole("employee");

  const { data: reward } = await supabase
    .from("loyalty_rewards")
    .select("*")
    .eq("id", rewardId)
    .eq("active", true)
    .single();
  if (!reward) return { error: "Nagrada nije pronađena." };
  if (profile.loyalty_points < reward.points_cost) {
    return { error: "Nemaš dovoljno poena za ovu nagradu." };
  }

  const { error: redeemError } = await supabase.from("loyalty_redemptions").insert({
    employee_id: user.id,
    reward_id: rewardId,
    points_spent: reward.points_cost,
  });
  if (redeemError) return { error: "Nagrada nije mogla biti preuzeta." };

  await supabase
    .from("profiles")
    .update({ loyalty_points: profile.loyalty_points - reward.points_cost })
    .eq("id", user.id);

  revalidatePath("/app/rewards");
  return { success: true };
}
