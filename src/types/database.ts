export type UserRole = "employee" | "office_manager" | "restaurant_staff" | "admin";
export type PaymentType = "company_pays" | "employee_pays" | "mixed";
export type OrderStatus = "pending" | "accepted" | "rejected" | "preparing" | "ready" | "picked_up" | "delivered";
export type EntityStatus = "active" | "inactive";
export type InvitationStatus = "pending" | "accepted" | "revoked";
export type DeliveryStatus = "scheduled" | "delayed" | "delivered";
export type CampaignType = "discount" | "free_item" | "free_delivery" | "other";
export type RewardType = "free_meal" | "dessert" | "drink" | "other";

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type Table<Row, InsertDefaults extends keyof Row = never, Rel extends Relationship[] = []> = {
  Row: Row;
  Insert: Partial<Pick<Row, InsertDefaults>> & Omit<Row, InsertDefaults>;
  Update: Partial<Row>;
  Relationships: Rel;
};

function rel(
  name: string,
  columns: string[],
  referencedRelation: string,
  isOneToOne = false
): Relationship {
  return { foreignKeyName: name, columns, referencedRelation, referencedColumns: ["id"], isOneToOne };
}

const PROFILES_RELATIONSHIPS = [
  rel("profiles_company_id_fkey", ["company_id"], "companies"),
  rel("profiles_restaurant_id_fkey", ["restaurant_id"], "restaurants"),
];
const INVITATIONS_RELATIONSHIPS = [
  rel("invitations_company_id_fkey", ["company_id"], "companies"),
  rel("invitations_restaurant_id_fkey", ["restaurant_id"], "restaurants"),
];
const RESTAURANT_SCHEDULE_RELATIONSHIPS = [rel("restaurant_schedule_restaurant_id_fkey", ["restaurant_id"], "restaurants")];
const MENU_ITEMS_RELATIONSHIPS = [rel("menu_items_restaurant_id_fkey", ["restaurant_id"], "restaurants")];
const DAILY_MENU_RELATIONSHIPS = [
  rel("daily_menu_restaurant_id_fkey", ["restaurant_id"], "restaurants"),
  rel("daily_menu_menu_item_id_fkey", ["menu_item_id"], "menu_items"),
];
const ORDERS_RELATIONSHIPS = [
  rel("orders_company_id_fkey", ["company_id"], "companies"),
  rel("orders_employee_id_fkey", ["employee_id"], "profiles"),
  rel("orders_restaurant_id_fkey", ["restaurant_id"], "restaurants"),
];
const ORDER_ITEMS_RELATIONSHIPS = [
  rel("order_items_order_id_fkey", ["order_id"], "orders"),
  rel("order_items_menu_item_id_fkey", ["menu_item_id"], "menu_items"),
];
const CAMPAIGNS_RELATIONSHIPS = [rel("campaigns_restaurant_id_fkey", ["restaurant_id"], "restaurants")];
const LOYALTY_REDEMPTIONS_RELATIONSHIPS = [
  rel("loyalty_redemptions_employee_id_fkey", ["employee_id"], "profiles"),
  rel("loyalty_redemptions_reward_id_fkey", ["reward_id"], "loyalty_rewards"),
];
const RATINGS_RELATIONSHIPS = [
  rel("ratings_order_id_fkey", ["order_id"], "orders"),
  rel("ratings_employee_id_fkey", ["employee_id"], "profiles"),
];
const DELIVERIES_RELATIONSHIPS = [rel("deliveries_company_id_fkey", ["company_id"], "companies")];

export type CompanyRow = {
  id: string;
  name: string;
  address: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  payment_type: PaymentType;
  daily_budget: number;
  monthly_budget: number | null;
  mixed_cap: number | null;
  cutoff_time: string;
  delivery_time: string;
  delivery_tolerance_minutes: number;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
};

export type RestaurantRow = {
  id: string;
  name: string;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  description: string | null;
  commission_percent: number;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
};

export type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  company_id: string | null;
  restaurant_id: string | null;
  daily_budget_override: number | null;
  loyalty_points: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type InvitationRow = {
  id: string;
  company_id: string | null;
  restaurant_id: string | null;
  email: string;
  full_name: string | null;
  role: UserRole;
  daily_budget_override: number | null;
  token: string;
  status: InvitationStatus;
  invited_by: string | null;
  created_at: string;
  accepted_at: string | null;
};

export type RestaurantScheduleRow = {
  id: string;
  restaurant_id: string;
  date: string;
  is_open: boolean;
  meal_limit: number;
  created_at: string;
};

export type MenuItemRow = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  calories: number | null;
  price: number;
  category: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type DailyMenuRow = {
  id: string;
  restaurant_id: string;
  menu_item_id: string;
  date: string;
  is_available: boolean;
  is_deal_of_day: boolean;
  deal_label: string | null;
  deal_price: number | null;
  created_at: string;
};

export type OrderRow = {
  id: string;
  company_id: string;
  employee_id: string | null;
  employee_name_snapshot: string | null;
  restaurant_id: string;
  order_date: string;
  status: OrderStatus;
  rejection_reason: string | null;
  prep_time_minutes: number | null;
  note: string | null;
  subtotal: number;
  company_covered: number;
  employee_paid: number;
  locked: boolean;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name_snapshot: string;
  price_snapshot: number;
  calories_snapshot: number | null;
  quantity: number;
  note: string | null;
};

export type CampaignRow = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  campaign_type: CampaignType;
  discount_percent: number | null;
  restaurant_id: string | null;
  starts_at: string;
  ends_at: string | null;
  active: boolean;
  created_at: string;
};

export type LoyaltyRewardRow = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  points_cost: number;
  reward_type: RewardType;
  active: boolean;
  created_at: string;
};

export type LoyaltyRedemptionRow = {
  id: string;
  employee_id: string;
  reward_id: string;
  points_spent: number;
  status: "pending" | "redeemed";
  created_at: string;
};

export type RatingRow = {
  id: string;
  order_id: string;
  employee_id: string;
  delivery_rating: number | null;
  food_rating: number | null;
  system_rating: number | null;
  comment: string | null;
  created_at: string;
};

export type PlatformSettingsRow = {
  id: boolean;
  loyalty_rsd_per_point: number;
  order_window_days: number;
};

export type DeliveryRow = {
  id: string;
  company_id: string;
  delivery_date: string;
  scheduled_at: string;
  delivered_at: string | null;
  status: DeliveryStatus;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      companies: Table<CompanyRow, "id" | "created_at" | "updated_at" | "status" | "payment_type" | "cutoff_time" | "delivery_time" | "delivery_tolerance_minutes" | "daily_budget" | "address" | "contact_phone" | "contact_email" | "monthly_budget" | "mixed_cap">;
      restaurants: Table<RestaurantRow, "id" | "created_at" | "updated_at" | "status" | "commission_percent" | "logo_url" | "address" | "phone" | "description">;
      profiles: Table<ProfileRow, "created_at" | "updated_at" | "role" | "loyalty_points" | "active" | "email" | "full_name" | "phone" | "avatar_url" | "company_id" | "restaurant_id" | "daily_budget_override", typeof PROFILES_RELATIONSHIPS>;
      invitations: Table<InvitationRow, "id" | "token" | "status" | "created_at" | "accepted_at" | "role" | "company_id" | "restaurant_id" | "full_name" | "daily_budget_override" | "invited_by", typeof INVITATIONS_RELATIONSHIPS>;
      restaurant_schedule: Table<RestaurantScheduleRow, "id" | "created_at" | "is_open" | "meal_limit", typeof RESTAURANT_SCHEDULE_RELATIONSHIPS>;
      menu_items: Table<MenuItemRow, "id" | "created_at" | "updated_at" | "active" | "category" | "description" | "image_url" | "calories", typeof MENU_ITEMS_RELATIONSHIPS>;
      daily_menu: Table<DailyMenuRow, "id" | "created_at" | "is_available" | "is_deal_of_day" | "deal_label" | "deal_price", typeof DAILY_MENU_RELATIONSHIPS>;
      orders: Table<OrderRow, "id" | "created_at" | "updated_at" | "status" | "locked" | "company_covered" | "employee_paid" | "subtotal" | "rejection_reason" | "prep_time_minutes" | "note" | "employee_id" | "employee_name_snapshot" | "delivered_at", typeof ORDERS_RELATIONSHIPS>;
      order_items: Table<OrderItemRow, "id" | "quantity" | "menu_item_id" | "note", typeof ORDER_ITEMS_RELATIONSHIPS>;
      campaigns: Table<CampaignRow, "id" | "created_at" | "active" | "campaign_type" | "starts_at" | "description" | "image_url" | "discount_percent" | "restaurant_id" | "ends_at", typeof CAMPAIGNS_RELATIONSHIPS>;
      loyalty_rewards: Table<LoyaltyRewardRow, "id" | "created_at" | "active" | "reward_type" | "description" | "image_url">;
      loyalty_redemptions: Table<LoyaltyRedemptionRow, "id" | "created_at" | "status", typeof LOYALTY_REDEMPTIONS_RELATIONSHIPS>;
      ratings: Table<RatingRow, "id" | "created_at" | "delivery_rating" | "food_rating" | "system_rating" | "comment", typeof RATINGS_RELATIONSHIPS>;
      deliveries: Table<DeliveryRow, "id" | "created_at" | "status" | "delivered_at", typeof DELIVERIES_RELATIONSHIPS>;
      platform_settings: Table<PlatformSettingsRow, "id" | "loyalty_rsd_per_point" | "order_window_days">;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
