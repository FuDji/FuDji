import "server-only";

import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth";

export async function getRestaurantContext() {
  const ctx = await requireRole("restaurant_staff");
  const { supabase, profile } = ctx;

  if (!profile.restaurant_id) redirect("/login");

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", profile.restaurant_id)
    .single();

  if (!restaurant) redirect("/login");

  return { ...ctx, restaurant };
}
