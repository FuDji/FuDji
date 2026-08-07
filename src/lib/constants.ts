export const CURRENCY_LOCALE = "sr-Latn-RS";
export const CURRENCY = "RSD";

export const PAYMENT_TYPE_LABELS = {
  company_pays: "Firma plaća sve",
  employee_pays: "Zaposleni plaća sam",
  mixed: "Kombinovano",
} as const;

export const ORDER_STATUS_META = {
  pending: { label: "Na čekanju", tone: "warning" },
  accepted: { label: "Prihvaćeno", tone: "default" },
  rejected: { label: "Odbijeno", tone: "destructive" },
  preparing: { label: "U pripremi", tone: "default" },
  ready: { label: "Spremno", tone: "success" },
  picked_up: { label: "Preuzeto od kurira", tone: "success" },
  delivered: { label: "Dostavljeno u firmu", tone: "success" },
} as const;

/** Prime Bite's flat platform fee earned per delivered meal, charged to the company. */
export const PLATFORM_FEE_PER_MEAL = 8;

export const MENU_CATEGORIES = [
  { value: "main", label: "Glavno jelo" },
  { value: "soup", label: "Supa / čorba" },
  { value: "salad", label: "Salata" },
  { value: "dessert", label: "Dezert" },
  { value: "drink", label: "Piće" },
  { value: "side", label: "Prilog" },
] as const;

export const CAMPAIGN_TYPE_LABELS = {
  discount: "Popust",
  free_item: "Gratis proizvod",
  free_delivery: "Besplatna dostava",
  other: "Ostalo",
} as const;

export const REWARD_TYPE_LABELS = {
  free_meal: "Besplatan obrok",
  dessert: "Dezert",
  drink: "Piće",
  other: "Ostalo",
} as const;

export const ROLE_LABELS = {
  employee: "Zaposleni",
  office_manager: "Office menadžer",
  restaurant_staff: "Restoran",
  admin: "Admin",
} as const;

export const ROLE_HOME: Record<string, string> = {
  employee: "/app",
  office_manager: "/company",
  restaurant_staff: "/restaurant",
  admin: "/admin",
};

export const DELIVERY_STATUS_LABELS = {
  scheduled: "Zakazano",
  delayed: "Kasni",
  delivered: "Dostavljeno",
} as const;
