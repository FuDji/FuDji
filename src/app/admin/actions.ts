"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { requireRole, ROLE_SCOPE } from "@/lib/auth";
import { createClient, type PortalScope } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  companySchema,
  restaurantSchema,
  campaignSchema,
  loyaltyRewardSchema,
  menuItemSchema,
} from "@/lib/validations";
import { deliveryGapMinutes, MIN_DELIVERY_GAP_MINUTES } from "@/lib/utils";
import { ROLE_HOME } from "@/lib/constants";
import { z } from "zod";

const impersonateCookieName = (scope: PortalScope) => `pb_impersonate_${scope}`;

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

export async function updateManagedUser(
  profileId: string,
  fullName: string,
  newPassword: string
): Promise<ActionState> {
  const { supabase } = await requireRole("admin");

  if (!fullName.trim()) return { error: "Ime je obavezno." };
  if (newPassword && newPassword.length < 6) {
    return { error: "Nova lozinka mora imati bar 6 karaktera." };
  }

  const { error: nameError } = await supabase
    .from("profiles")
    .update({ full_name: fullName.trim() })
    .eq("id", profileId);
  if (nameError) return { error: "Ime nije moglo biti sačuvano." };

  if (newPassword) {
    const admin = createAdminClient();
    const { error: passwordError } = await admin.auth.admin.updateUserById(profileId, {
      password: newPassword,
    });
    if (passwordError) return { error: "Lozinka nije mogla biti promenjena." };
  }

  revalidatePath("/admin/companies");
  revalidatePath("/admin/restaurants");
  return { success: true };
}

/**
 * Logs the admin in as another user for support/debugging, without needing
 * their password. Each portal keeps its own isolated session cookie (see
 * lib/supabase/server.ts), so this writes the target's session into THEIR
 * portal's scope only — the admin's own /admin session is never touched and
 * stays valid the entire time, no "return token" juggling required.
 */
export async function impersonateUser(targetProfileId: string): Promise<ActionState> {
  const { supabase, profile: adminProfile } = await requireRole("admin");

  const { data: target } = await supabase
    .from("profiles")
    .select("id, email, role, active")
    .eq("id", targetProfileId)
    .single();

  if (!target) return { error: "Korisnik nije pronađen." };
  if (target.role === "admin") return { error: "Ne možeš ući u nalog drugog admina." };
  if (!target.active) return { error: "Nalog je deaktiviran." };
  if (!target.email) return { error: "Ovaj nalog nema imejl adresu." };

  const admin = createAdminClient();
  const { data: targetLink, error: targetLinkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: target.email,
  });
  if (targetLinkError || !targetLink?.properties?.hashed_token) {
    return { error: "Nije moguće ući u ovaj nalog." };
  }

  const targetScope = ROLE_SCOPE[target.role];
  const scopedClient = await createClient(targetScope);
  const { error: verifyError } = await scopedClient.auth.verifyOtp({
    type: "magiclink",
    token_hash: targetLink.properties.hashed_token,
  });
  if (verifyError) return { error: "Ulazak u nalog nije uspeo." };

  const cookieStore = await cookies();
  cookieStore.set(impersonateCookieName(targetScope), adminProfile.full_name ?? adminProfile.email ?? "Admin", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: `/${targetScope}`,
    maxAge: 60 * 60,
  });

  redirect(ROLE_HOME[target.role] ?? "/login");
}

/** Ends the impersonated session in the given portal scope; the admin's own session is untouched. */
export async function stopImpersonating(scope: PortalScope): Promise<ActionState> {
  const supabase = await createClient(scope);
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete(impersonateCookieName(scope));

  redirect("/admin");
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

/** Admin can force a menu item off (or back on) for a restaurant that isn't managing it themselves. */
export async function toggleMenuItemActiveAdmin(itemId: string, active: boolean): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
  const { data: item } = await supabase.from("menu_items").select("restaurant_id").eq("id", itemId).single();
  const { error } = await supabase.from("menu_items").update({ active }).eq("id", itemId);
  if (error) return { error: "Status nije mogao biti sačuvan." };
  if (item) revalidatePath(`/admin/restaurants/${item.restaurant_id}/menu`);
  return { success: true };
}

/** Full add/edit of a restaurant's menu item, for when the restaurant can't or doesn't do it themselves. */
export async function upsertMenuItemAdmin(
  restaurantId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
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
      .eq("restaurant_id", restaurantId);
    if (error) return { error: "Jelo nije moglo biti sačuvano." };
  } else {
    const { error } = await supabase.from("menu_items").insert({
      ...parsed.data,
      image_url: parsed.data.image_url || null,
      restaurant_id: restaurantId,
    });
    if (error) return { error: "Jelo nije moglo biti kreirano." };
  }

  revalidatePath(`/admin/restaurants/${restaurantId}/menu`);
  return { success: true };
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
// LOYALTY PROGRAM
// ---------------------------------------------------------------------------
export async function updateLoyaltySettings(rsdPerPoint: number): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
  if (!Number.isFinite(rsdPerPoint) || rsdPerPoint < 1) {
    return { error: "Unesi validan iznos u dinarima." };
  }
  const { error } = await supabase
    .from("platform_settings")
    .update({ loyalty_rsd_per_point: Math.round(rsdPerPoint) })
    .eq("id", true);
  if (error) return { error: "Podešavanje nije moglo biti sačuvano." };
  revalidatePath("/admin/loyalty");
  return { success: true };
}

export async function updateOrderWindow(days: number): Promise<ActionState> {
  const { supabase } = await requireRole("admin");
  if (!Number.isFinite(days) || days < 1 || days > 60) {
    return { error: "Unesi broj dana između 1 i 60." };
  }
  const { error } = await supabase
    .from("platform_settings")
    .update({ order_window_days: Math.round(days) })
    .eq("id", true);
  if (error) return { error: "Podešavanje nije moglo biti sačuvano." };
  revalidatePath("/admin/settings");
  revalidatePath("/app/menu");
  return { success: true };
}

/** Awards loyalty points (floor(subtotal / rsdPerPoint)) to each order's employee. */
async function awardLoyaltyPoints(
  supabase: Awaited<ReturnType<typeof requireRole>>["supabase"],
  orders: { employee_id: string | null; subtotal: number }[]
) {
  const eligible = orders.filter((o): o is { employee_id: string; subtotal: number } => !!o.employee_id);
  if (eligible.length === 0) return;

  const { data: settings } = await supabase
    .from("platform_settings")
    .select("loyalty_rsd_per_point")
    .eq("id", true)
    .single();
  const rsdPerPoint = settings?.loyalty_rsd_per_point ?? 100;

  const pointsByEmployee = new Map<string, number>();
  for (const o of eligible) {
    const points = Math.floor(o.subtotal / rsdPerPoint);
    if (points <= 0) continue;
    pointsByEmployee.set(o.employee_id, (pointsByEmployee.get(o.employee_id) ?? 0) + points);
  }
  if (pointsByEmployee.size === 0) return;

  const { data: employees } = await supabase
    .from("profiles")
    .select("id, loyalty_points")
    .in("id", [...pointsByEmployee.keys()]);

  await Promise.all(
    (employees ?? []).map((e) =>
      supabase
        .from("profiles")
        .update({ loyalty_points: e.loyalty_points + (pointsByEmployee.get(e.id) ?? 0) })
        .eq("id", e.id)
    )
  );
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

  const { data: toDeliver } = await supabase
    .from("orders")
    .select("employee_id, subtotal")
    .eq("company_id", companyId)
    .eq("order_date", date)
    .eq("status", "picked_up");

  await supabase
    .from("orders")
    .update({ status: "delivered", delivered_at: new Date().toISOString() })
    .eq("company_id", companyId)
    .eq("order_date", date)
    .eq("status", "picked_up");

  await awardLoyaltyPoints(supabase, toDeliver ?? []);

  revalidatePath("/admin/deliveries");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/loyalty");
  return { success: true };
}
