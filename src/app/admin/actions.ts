"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import {
  companySchema,
  restaurantSchema,
  campaignSchema,
  loyaltyRewardSchema,
} from "@/lib/validations";
import { deliveryGapMinutes, MIN_DELIVERY_GAP_MINUTES } from "@/lib/utils";
import { z } from "zod";

export type ActionState = { error?: string; success?: boolean; inviteLink?: string } | undefined;

// ---------------------------------------------------------------------------
// COMPANIES
// ---------------------------------------------------------------------------
export async function upsertCompany(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
  const id = formData.get("id") as string | null;

  const parsed = companySchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    contact_phone: formData.get("contact_phone"),
    contact_email: formData.get("contact_email"),
    payment_type: formData.get("payment_type"),
    daily_budget: formData.get("daily_budget"),
    monthly_budget: formData.get("monthly_budget") || null,
    mixed_cap: formData.get("mixed_cap") || null,
    cutoff_time: formData.get("cutoff_time"),
    delivery_time: formData.get("delivery_time"),
    delivery_tolerance_minutes: formData.get("delivery_tolerance_minutes"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Neispravan unos" };

  if (deliveryGapMinutes(parsed.data.cutoff_time, parsed.data.delivery_time) < MIN_DELIVERY_GAP_MINUTES) {
    return { error: `Termin dostave mora biti bar ${MIN_DELIVERY_GAP_MINUTES} minuta posle roka za naručivanje.` };
  }

  if (id) {
    const { error } = await supabase.from("companies").update(parsed.data).eq("id", id);
    if (error) return { error: "Firma nije mogla biti sačuvana." };
  } else {
    const { error } = await supabase.from("companies").insert(parsed.data);
    if (error) return { error: "Firma nije mogla biti kreirana." };
  }

  revalidatePath("/admin/companies");
  return { success: true };
}

export async function toggleCompanyStatus(companyId: string, active: boolean): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
  const { error } = await supabase
    .from("companies")
    .update({ status: active ? "active" : "inactive" })
    .eq("id", companyId);
  if (error) return { error: "Status nije mogao biti sačuvan." };
  revalidatePath("/admin/companies");
  return { success: true };
}

export async function inviteOfficeManager(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase, user } = await requireRole("admin");

  const parsed = z
    .object({ full_name: z.string().min(2), email: z.string().email(), company_id: z.string().uuid() })
    .safeParse({
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      company_id: formData.get("company_id"),
    });
  if (!parsed.success) return { error: "Neispravan unos" };

  const { data, error } = await supabase
    .from("invitations")
    .insert({
      company_id: parsed.data.company_id,
      email: parsed.data.email,
      full_name: parsed.data.full_name,
      role: "office_manager",
      invited_by: user.id,
    })
    .select("token")
    .single();

  if (error || !data) return { error: "Pozivnica nije mogla biti kreirana." };
  return { success: true, inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${data.token}` };
}

// ---------------------------------------------------------------------------
// PEOPLE (office managers / restaurant staff — shared by companies + restaurants pages)
// ---------------------------------------------------------------------------
export async function toggleProfileActive(profileId: string, active: boolean): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
  const { error } = await supabase.from("profiles").update({ active }).eq("id", profileId);
  if (error) return { error: "Status nije mogao biti sačuvan." };
  revalidatePath("/admin/companies");
  revalidatePath("/admin/restaurants");
  return { success: true };
}

export async function revokeInvitation(invitationId: string): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
  const { error } = await supabase
    .from("invitations")
    .update({ status: "revoked" })
    .eq("id", invitationId);
  if (error) return { error: "Pozivnica nije mogla biti opozvana." };
  revalidatePath("/admin/companies");
  revalidatePath("/admin/restaurants");
  return { success: true };
}

// ---------------------------------------------------------------------------
// RESTAURANTS
// ---------------------------------------------------------------------------
export async function upsertRestaurant(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
  const id = formData.get("id") as string | null;

  const parsed = restaurantSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    description: formData.get("description"),
    logo_url: formData.get("logo_url"),
    commission_percent: formData.get("commission_percent"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Neispravan unos" };

  const payload = { ...parsed.data, logo_url: parsed.data.logo_url || null };

  if (id) {
    const { error } = await supabase.from("restaurants").update(payload).eq("id", id);
    if (error) return { error: "Restoran nije mogao biti sačuvan." };
  } else {
    const { error } = await supabase.from("restaurants").insert(payload);
    if (error) return { error: "Restoran nije mogao biti kreiran." };
  }

  revalidatePath("/admin/restaurants");
  return { success: true };
}

export async function toggleRestaurantStatus(restaurantId: string, active: boolean): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
  const { error } = await supabase
    .from("restaurants")
    .update({ status: active ? "active" : "inactive" })
    .eq("id", restaurantId);
  if (error) return { error: "Status nije mogao biti sačuvan." };
  revalidatePath("/admin/restaurants");
  return { success: true };
}

export async function inviteRestaurantStaff(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase, user } = await requireRole("admin");

  const parsed = z
    .object({ full_name: z.string().min(2), email: z.string().email(), restaurant_id: z.string().uuid() })
    .safeParse({
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      restaurant_id: formData.get("restaurant_id"),
    });
  if (!parsed.success) return { error: "Neispravan unos" };

  const { data, error } = await supabase
    .from("invitations")
    .insert({
      restaurant_id: parsed.data.restaurant_id,
      email: parsed.data.email,
      full_name: parsed.data.full_name,
      role: "restaurant_staff",
      invited_by: user.id,
    })
    .select("token")
    .single();

  if (error || !data) return { error: "Pozivnica nije mogla biti kreirana." };
  return { success: true, inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${data.token}` };
}

// ---------------------------------------------------------------------------
// SCHEDULE (admin can set any restaurant's weekly schedule)
// ---------------------------------------------------------------------------
export async function setRestaurantSchedule(
  restaurantId: string,
  date: string,
  isOpen: boolean,
  mealLimit: number
): Promise<ActionState> {
  const { supabase } = await requireRole("admin");

  const { error } = await supabase.from("restaurant_schedule").upsert(
    { restaurant_id: restaurantId, date, is_open: isOpen, meal_limit: mealLimit },
    { onConflict: "restaurant_id,date" }
  );
  if (error) return { error: "Plan nije mogao biti sačuvan." };
  revalidatePath("/admin/schedule");
  return { success: true };
}

// ---------------------------------------------------------------------------
// CAMPAIGNS
// ---------------------------------------------------------------------------
export async function upsertCampaign(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
  const id = formData.get("id") as string | null;

  const parsed = campaignSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    image_url: formData.get("image_url"),
    campaign_type: formData.get("campaign_type"),
    discount_percent: formData.get("discount_percent") || null,
    restaurant_id: formData.get("restaurant_id") || "",
    starts_at: formData.get("starts_at"),
    ends_at: formData.get("ends_at") || "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Neispravan unos" };

  const payload = {
    ...parsed.data,
    image_url: parsed.data.image_url || null,
    restaurant_id: parsed.data.restaurant_id || null,
    ends_at: parsed.data.ends_at || null,
  };

  if (id) {
    const { error } = await supabase.from("campaigns").update(payload).eq("id", id);
    if (error) return { error: "Kampanja nije mogla biti sačuvana." };
  } else {
    const { error } = await supabase.from("campaigns").insert(payload);
    if (error) return { error: "Kampanja nije mogla biti kreirana." };
  }

  revalidatePath("/admin/campaigns");
  revalidatePath("/app/actions");
  return { success: true };
}

export async function toggleCampaignActive(campaignId: string, active: boolean): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
  const { error } = await supabase.from("campaigns").update({ active }).eq("id", campaignId);
  if (error) return { error: "Status nije mogao biti sačuvan." };
  revalidatePath("/admin/campaigns");
  return { success: true };
}

// ---------------------------------------------------------------------------
// LOYALTY REWARDS
// ---------------------------------------------------------------------------
export async function upsertReward(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
  const id = formData.get("id") as string | null;

  const parsed = loyaltyRewardSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    image_url: formData.get("image_url"),
    points_cost: formData.get("points_cost"),
    reward_type: formData.get("reward_type"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Neispravan unos" };

  const payload = { ...parsed.data, image_url: parsed.data.image_url || null };

  if (id) {
    const { error } = await supabase.from("loyalty_rewards").update(payload).eq("id", id);
    if (error) return { error: "Nagrada nije mogla biti sačuvana." };
  } else {
    const { error } = await supabase.from("loyalty_rewards").insert(payload);
    if (error) return { error: "Nagrada nije mogla biti kreirana." };
  }

  revalidatePath("/admin/rewards");
  return { success: true };
}

export async function toggleRewardActive(rewardId: string, active: boolean): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
  const { error } = await supabase.from("loyalty_rewards").update({ active }).eq("id", rewardId);
  if (error) return { error: "Status nije mogao biti sačuvan." };
  revalidatePath("/admin/rewards");
  return { success: true };
}

// ---------------------------------------------------------------------------
// DELIVERIES
// ---------------------------------------------------------------------------
export async function markCompanyDelivered(
  companyId: string,
  date: string,
  scheduledAt: string
): Promise<ActionState> {
  const { supabase } = await requireRole("admin");

  const { count: notPickedUp } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId)
    .eq("order_date", date)
    .neq("status", "rejected")
    .neq("status", "picked_up")
    .neq("status", "delivered");
  if ((notPickedUp ?? 0) > 0) {
    return { error: "Neke narudžbine još nisu preuzete od restorana." };
  }

  const { error } = await supabase.from("deliveries").upsert(
    {
      company_id: companyId,
      delivery_date: date,
      scheduled_at: scheduledAt,
      status: "delivered",
      delivered_at: new Date().toISOString(),
    },
    { onConflict: "company_id,delivery_date" }
  );
  if (error) return { error: "Dostava nije mogla biti označena." };

  await supabase
    .from("orders")
    .update({ status: "delivered" })
    .eq("company_id", companyId)
    .eq("order_date", date)
    .eq("status", "picked_up");

  revalidatePath("/admin/deliveries");
  revalidatePath("/admin/orders");
  return { success: true };
}
