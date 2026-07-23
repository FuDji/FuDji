import type { Database } from "./database";

export type Apartment = Database["public"]["Tables"]["apartments"]["Row"];
export type ApartmentInsert = Database["public"]["Tables"]["apartments"]["Insert"];
export type GuideSection = Database["public"]["Tables"]["guide_sections"]["Row"];
export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type RoomItem = Database["public"]["Tables"]["room_items"]["Row"];
export type QrCode = Database["public"]["Tables"]["qr_codes"]["Row"];
export type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"];
export type MaintenanceIssue = Database["public"]["Tables"]["maintenance_issues"]["Row"];
export type MaintenanceEvent = Database["public"]["Tables"]["maintenance_events"]["Row"];
export type EmergencyContact = Database["public"]["Tables"]["emergency_contacts"]["Row"];

export type InventoryCategory = InventoryItem["category"];
export type InventoryStatus = InventoryItem["status"];
export type MaintenanceCategory = MaintenanceIssue["category"];
export type MaintenancePriority = MaintenanceIssue["priority"];
export type MaintenanceStatus = MaintenanceIssue["status"];
