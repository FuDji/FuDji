import { z } from "zod";

const optionalText = () =>
  z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null));

const optionalUrl = () =>
  z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null));

const optionalEmail = () =>
  z
    .string()
    .email()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null));

const optionalUuid = () =>
  z
    .string()
    .uuid()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null));

const optionalNumber = () =>
  z.coerce
    .number()
    .optional()
    .nullable()
    .transform((v) => v ?? null);

export const loginSchema = z.object({
  email: z.string().email("Unesi ispravan email"),
  // No length/strength rule here — the account may have been created directly
  // in Supabase with a shorter password. Strength rules belong on the forms
  // that actually set a new password (reset / accept-invite), not on login.
  password: z.string().min(1, "Unesi lozinku"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Unesi ispravan email"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Lozinka mora imati bar 8 karaktera"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lozinke se ne poklapaju",
    path: ["confirmPassword"],
  });

export const acceptInviteSchema = z
  .object({
    token: z.string().uuid(),
    password: z.string().min(8, "Lozinka mora imati bar 8 karaktera"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lozinke se ne poklapaju",
    path: ["confirmPassword"],
  });

export const companySchema = z.object({
  name: z.string().min(2, "Naziv je obavezan"),
  address: optionalText(),
  contact_phone: optionalText(),
  contact_email: optionalEmail(),
  payment_type: z.enum(["company_pays", "employee_pays", "mixed"]),
  daily_budget: z.coerce.number().min(0),
  monthly_budget: optionalNumber(),
  mixed_cap: optionalNumber(),
  cutoff_time: z.string().min(1),
  delivery_time: z.string().min(1),
  delivery_tolerance_minutes: z.coerce.number().int().min(0),
});

/** Office managers can tune delivery logistics but not the ordering cutoff — that's admin-only. */
export const companySettingsSchema = companySchema.omit({ cutoff_time: true });

export const restaurantSchema = z.object({
  name: z.string().min(2, "Naziv je obavezan"),
  address: optionalText(),
  phone: optionalText(),
  description: optionalText(),
  logo_url: optionalUrl(),
  commission_percent: z.coerce.number().min(0).max(100),
});

export const menuItemSchema = z.object({
  name: z.string().min(1, "Naziv je obavezan"),
  description: optionalText(),
  image_url: optionalUrl(),
  calories: optionalNumber(),
  price: z.coerce.number().min(0),
  category: optionalText(),
});

export const campaignSchema = z.object({
  title: z.string().min(1, "Naslov je obavezan"),
  description: optionalText(),
  image_url: optionalUrl(),
  campaign_type: z.enum(["discount", "free_item", "free_delivery", "other"]),
  discount_percent: optionalNumber(),
  restaurant_id: optionalUuid(),
  starts_at: z.string().min(1),
  ends_at: optionalText(),
});

export const loyaltyRewardSchema = z.object({
  title: z.string().min(1, "Naslov je obavezan"),
  description: optionalText(),
  image_url: optionalUrl(),
  points_cost: z.coerce.number().int().min(1),
  reward_type: z.enum(["free_meal", "dessert", "drink", "other"]),
});

export const inviteEmployeeSchema = z.object({
  full_name: z.string().min(2, "Unesi ime i prezime"),
  email: z.string().email("Unesi ispravan email"),
  daily_budget_override: optionalNumber(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CompanyInput = z.infer<typeof companySchema>;
export type RestaurantInput = z.infer<typeof restaurantSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
export type LoyaltyRewardInput = z.infer<typeof loyaltyRewardSchema>;
export type InviteEmployeeInput = z.infer<typeof inviteEmployeeSchema>;
