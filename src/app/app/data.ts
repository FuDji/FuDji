import "server-only";

import { requireRole } from "@/lib/auth";
import type { DailyMenu, MenuItem, Order, OrderItem, Restaurant, RestaurantSchedule } from "@/types";

export async function getEmployeeContext() {
  const ctx = await requireRole("employee");
  const { supabase, profile } = ctx;

  const company = profile.company_id
    ? (await supabase.from("companies").select("*").eq("id", profile.company_id).single()).data
    : null;

  return { ...ctx, company };
}

type ScheduleWithRestaurant = RestaurantSchedule & { restaurant: Restaurant };
type DailyMenuWithItem = DailyMenu & { menu_item: MenuItem };

export async function getRestaurantsForDate(
  supabase: Awaited<ReturnType<typeof getEmployeeContext>>["supabase"],
  date: string
) {
  const { data: schedule } = await supabase
    .from("restaurant_schedule")
    .select("*, restaurant:restaurants(*)")
    .eq("date", date)
    .eq("is_open", true)
    .returns<ScheduleWithRestaurant[]>();

  const openSchedules = (schedule ?? []).filter((s) => s.restaurant?.status === "active");

  const restaurantIds = openSchedules.map((s) => s.restaurant_id);
  if (restaurantIds.length === 0) return [];

  const { data: dailyMenu } = await supabase
    .from("daily_menu")
    .select("*, menu_item:menu_items(*)")
    .eq("date", date)
    .in("restaurant_id", restaurantIds)
    .eq("is_available", true)
    .returns<DailyMenuWithItem[]>();

  const { data: orderCounts } = await supabase
    .from("orders")
    .select("restaurant_id")
    .eq("order_date", date)
    .neq("status", "rejected")
    .in("restaurant_id", restaurantIds);

  const countByRestaurant = new Map<string, number>();
  for (const o of orderCounts ?? []) {
    countByRestaurant.set(o.restaurant_id, (countByRestaurant.get(o.restaurant_id) ?? 0) + 1);
  }

  return openSchedules.map((s) => ({
    schedule: s,
    restaurant: s.restaurant,
    menu: (dailyMenu ?? []).filter((m) => m.restaurant_id === s.restaurant_id),
    ordersCount: countByRestaurant.get(s.restaurant_id) ?? 0,
    full: (countByRestaurant.get(s.restaurant_id) ?? 0) >= s.meal_limit,
  }));
}

export type OrderForDate = Order & {
  order_items: OrderItem[];
  restaurant: Pick<Restaurant, "id" | "name" | "logo_url"> | null;
  rating: { id: string }[];
};

export async function getOrderForDate(
  supabase: Awaited<ReturnType<typeof getEmployeeContext>>["supabase"],
  employeeId: string,
  date: string
) {
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*), restaurant:restaurants(id, name, logo_url), rating:ratings(id)")
    .eq("employee_id", employeeId)
    .eq("order_date", date)
    .maybeSingle()
    .returns<OrderForDate>();
  return data;
}
