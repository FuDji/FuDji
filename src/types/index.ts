import type {
  CampaignRow,
  CompanyRow,
  DailyMenuRow,
  DeliveryRow,
  InvitationRow,
  LoyaltyRedemptionRow,
  LoyaltyRewardRow,
  MenuItemRow,
  OrderItemRow,
  OrderRow,
  ProfileRow,
  RatingRow,
  RestaurantRow,
  RestaurantScheduleRow,
} from "./database";

export type {
  UserRole,
  PaymentType,
  OrderStatus,
  EntityStatus,
  InvitationStatus,
  DeliveryStatus,
  CampaignType,
  RewardType,
} from "./database";

export type Company = CompanyRow;
export type Restaurant = RestaurantRow;
export type Profile = ProfileRow;
export type Invitation = InvitationRow;
export type RestaurantSchedule = RestaurantScheduleRow;
export type MenuItem = MenuItemRow;
export type DailyMenu = DailyMenuRow;
export type Order = OrderRow;
export type OrderItem = OrderItemRow;
export type Campaign = CampaignRow;
export type LoyaltyReward = LoyaltyRewardRow;
export type LoyaltyRedemption = LoyaltyRedemptionRow;
export type Rating = RatingRow;
export type Delivery = DeliveryRow;

export type DailyMenuWithItem = DailyMenu & { menu_item: MenuItem };

export type CampaignWithRestaurant = Campaign & { restaurant: Pick<Restaurant, "name"> | null };

export type OrderWithNames = Order & {
  employee: { full_name: string | null } | null;
  company: { name: string } | null;
  restaurant: { name: string } | null;
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
  employee?: Pick<Profile, "id" | "full_name" | "email"> | null;
  company?: Pick<Company, "id" | "name"> | null;
  restaurant?: Pick<Restaurant, "id" | "name"> | null;
};

export const ORDER_STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Na čekanju",
  accepted: "Prihvaćeno",
  rejected: "Odbijeno",
  preparing: "U pripremi",
  ready: "Spremno",
  delivered: "Dostavljeno",
};

export const DAY_LABELS_SR = [
  "Nedelja",
  "Ponedeljak",
  "Utorak",
  "Sreda",
  "Četvrtak",
  "Petak",
  "Subota",
] as const;
