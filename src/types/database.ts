// Hand-written mirror of supabase/migrations/*.sql
// Regenerate with `supabase gen types typescript` once a live project exists.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface GuideBlock {
  id: string;
  type: "text" | "image" | "video" | "pdf" | "link" | "button" | "map";
  content?: string;
  url?: string;
  label?: string;
  lat?: number;
  lng?: number;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<
        {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          company_name: string | null;
          created_at: string;
          updated_at: string;
        },
        { id: string; full_name?: string | null; avatar_url?: string | null; company_name?: string | null }
      >;
      apartments: Table<
        {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          hero_image_url: string | null;
          address: string | null;
          country: string | null;
          city: string | null;
          lat: number | null;
          lng: number | null;
          phone: string | null;
          email: string | null;
          check_in_time: string | null;
          check_out_time: string | null;
          wifi_name: string | null;
          wifi_password: string | null;
          parking_info: string | null;
          description: string | null;
          brand_color: string | null;
          font: string | null;
          language: string | null;
          custom_domain: string | null;
          timezone: string | null;
          status: "active" | "draft" | "archived";
          created_at: string;
          updated_at: string;
        },
        {
          owner_id: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          hero_image_url?: string | null;
          address?: string | null;
          country?: string | null;
          city?: string | null;
          lat?: number | null;
          lng?: number | null;
          phone?: string | null;
          email?: string | null;
          check_in_time?: string | null;
          check_out_time?: string | null;
          wifi_name?: string | null;
          wifi_password?: string | null;
          parking_info?: string | null;
          description?: string | null;
          brand_color?: string | null;
          font?: string | null;
          language?: string | null;
          custom_domain?: string | null;
          timezone?: string | null;
          status?: "active" | "draft" | "archived";
        }
      >;
      apartment_gallery: Table<
        { id: string; apartment_id: string; url: string; position: number; created_at: string },
        { apartment_id: string; url: string; position?: number }
      >;
      emergency_contacts: Table<
        { id: string; apartment_id: string; label: string; phone: string; notes: string | null; position: number },
        { apartment_id: string; label: string; phone: string; notes?: string | null; position?: number }
      >;
      guide_sections: Table<
        {
          id: string;
          apartment_id: string;
          key: string;
          title: string;
          icon: string | null;
          position: number;
          published: boolean;
          blocks: GuideBlock[];
          view_count: number;
          created_at: string;
          updated_at: string;
        },
        {
          apartment_id: string;
          key: string;
          title: string;
          icon?: string | null;
          position?: number;
          published?: boolean;
          blocks?: GuideBlock[];
        }
      >;
      rooms: Table<
        {
          id: string;
          apartment_id: string;
          name: string;
          icon: string | null;
          cover_image_url: string | null;
          position: number;
          created_at: string;
          updated_at: string;
        },
        { apartment_id: string; name: string; icon?: string | null; cover_image_url?: string | null; position?: number }
      >;
      room_items: Table<
        {
          id: string;
          room_id: string;
          name: string;
          icon: string | null;
          images: string[];
          instructions: string | null;
          video_url: string | null;
          warnings: string | null;
          tips: string | null;
          faqs: FaqEntry[];
          position: number;
          created_at: string;
          updated_at: string;
        },
        {
          room_id: string;
          name: string;
          icon?: string | null;
          images?: string[];
          instructions?: string | null;
          video_url?: string | null;
          warnings?: string | null;
          tips?: string | null;
          faqs?: FaqEntry[];
          position?: number;
        }
      >;
      qr_codes: Table<
        {
          id: string;
          apartment_id: string;
          target_type: "apartment" | "guide_section" | "room" | "room_item";
          target_id: string;
          label: string;
          slug: string;
          style: Json;
          scan_count: number;
          created_at: string;
        },
        {
          apartment_id: string;
          target_type: "apartment" | "guide_section" | "room" | "room_item";
          target_id: string;
          label: string;
          slug: string;
          style?: Json;
        },
        {
          apartment_id?: string;
          target_type?: "apartment" | "guide_section" | "room" | "room_item";
          target_id?: string;
          label?: string;
          slug?: string;
          style?: Json;
          scan_count?: number;
        }
      >;
      qr_scans: Table<
        { id: string; qr_code_id: string; scanned_at: string; user_agent: string | null; referrer: string | null; country: string | null },
        { qr_code_id: string; user_agent?: string | null; referrer?: string | null; country?: string | null }
      >;
      inventory_items: Table<
        {
          id: string;
          apartment_id: string;
          category: "kitchen" | "bathroom" | "bedroom" | "living_room" | "outdoor" | "cleaning_supplies";
          name: string;
          photo_url: string | null;
          quantity: number;
          min_quantity: number;
          location: string | null;
          notes: string | null;
          status: "ok" | "low" | "missing" | "broken" | "needs_replacement";
          created_at: string;
          updated_at: string;
        },
        {
          apartment_id: string;
          category: "kitchen" | "bathroom" | "bedroom" | "living_room" | "outdoor" | "cleaning_supplies";
          name: string;
          photo_url?: string | null;
          quantity?: number;
          min_quantity?: number;
          location?: string | null;
          notes?: string | null;
          status?: "ok" | "low" | "missing" | "broken" | "needs_replacement";
        }
      >;
      inventory_reports: Table<
        {
          id: string;
          item_id: string;
          reported_by: string | null;
          type: "missing" | "broken" | "needs_replacement";
          notes: string | null;
          resolved: boolean;
          created_at: string;
        },
        { item_id: string; reported_by?: string | null; type: "missing" | "broken" | "needs_replacement"; notes?: string | null }
      >;
      maintenance_issues: Table<
        {
          id: string;
          apartment_id: string;
          room_id: string | null;
          title: string;
          description: string | null;
          category: "electrical" | "water" | "furniture" | "appliances" | "cleaning" | "safety" | "other";
          priority: "low" | "medium" | "high" | "urgent";
          status: "open" | "in_progress" | "resolved" | "closed";
          photo_url: string | null;
          video_url: string | null;
          assigned_to: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
        },
        {
          apartment_id: string;
          room_id?: string | null;
          title: string;
          description?: string | null;
          category: "electrical" | "water" | "furniture" | "appliances" | "cleaning" | "safety" | "other";
          priority?: "low" | "medium" | "high" | "urgent";
          status?: "open" | "in_progress" | "resolved" | "closed";
          photo_url?: string | null;
          video_url?: string | null;
          assigned_to?: string | null;
          due_date?: string | null;
        },
        {
          room_id?: string | null;
          title?: string;
          description?: string | null;
          category?: "electrical" | "water" | "furniture" | "appliances" | "cleaning" | "safety" | "other";
          priority?: "low" | "medium" | "high" | "urgent";
          status?: "open" | "in_progress" | "resolved" | "closed";
          photo_url?: string | null;
          video_url?: string | null;
          assigned_to?: string | null;
          due_date?: string | null;
          resolved_at?: string | null;
        }
      >;
      maintenance_events: Table<
        { id: string; issue_id: string; type: string; note: string | null; created_at: string },
        { issue_id: string; type: string; note?: string | null }
      >;
      guide_views: Table<
        { id: string; apartment_id: string; section_id: string | null; viewed_at: string; session_id: string | null },
        { apartment_id: string; section_id?: string | null; session_id?: string | null }
      >;
      ai_conversations: Table<
        { id: string; apartment_id: string; session_id: string; created_at: string },
        { apartment_id: string; session_id: string }
      >;
      ai_messages: Table<
        { id: string; conversation_id: string; role: "user" | "assistant"; content: string; created_at: string },
        { conversation_id: string; role: "user" | "assistant"; content: string }
      >;
      notification_preferences: Table<
        {
          apartment_id: string;
          email_maintenance: boolean;
          email_inventory: boolean;
          email_guest_activity: boolean;
          email_weekly_report: boolean;
        },
        { apartment_id: string; email_maintenance?: boolean; email_inventory?: boolean; email_guest_activity?: boolean; email_weekly_report?: boolean }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
