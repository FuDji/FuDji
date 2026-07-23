import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const apartmentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  logo_url: z.string().url().optional().or(z.literal("")),
  hero_image_url: z.string().url().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  lat: z.coerce.number().optional().nullable(),
  lng: z.coerce.number().optional().nullable(),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  check_in_time: z.string().optional().or(z.literal("")),
  check_out_time: z.string().optional().or(z.literal("")),
  wifi_name: z.string().optional().or(z.literal("")),
  wifi_password: z.string().optional().or(z.literal("")),
  parking_info: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

export const guideSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  icon: z.string().optional(),
  published: z.boolean().optional(),
});

export const roomSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  cover_image_url: z.string().url().optional().or(z.literal("")),
});

export const roomItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  instructions: z.string().optional().or(z.literal("")),
  video_url: z.string().url().optional().or(z.literal("")),
  warnings: z.string().optional().or(z.literal("")),
  tips: z.string().optional().or(z.literal("")),
});

export const inventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["kitchen", "bathroom", "bedroom", "living_room", "outdoor", "cleaning_supplies"]),
  quantity: z.coerce.number().int().min(0),
  min_quantity: z.coerce.number().int().min(0),
  location: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  photo_url: z.string().url().optional().or(z.literal("")),
});

export const maintenanceIssueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().or(z.literal("")),
  category: z.enum(["electrical", "water", "furniture", "appliances", "cleaning", "safety", "other"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  room_id: z.string().uuid().optional().or(z.literal("")),
  assigned_to: z.string().optional().or(z.literal("")),
  due_date: z.string().optional().or(z.literal("")),
  photo_url: z.string().url().optional().or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ApartmentInput = z.infer<typeof apartmentSchema>;
export type RoomInput = z.infer<typeof roomSchema>;
export type RoomItemInput = z.infer<typeof roomItemSchema>;
export type InventoryItemInput = z.infer<typeof inventoryItemSchema>;
export type MaintenanceIssueInput = z.infer<typeof maintenanceIssueSchema>;
