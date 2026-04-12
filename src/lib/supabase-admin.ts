import type { BillingPlan, BillingStatus } from "@/lib/billing";
import { createClient } from "@supabase/supabase-js";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          billing_email: string | null;
          is_pro: boolean;
          plan: string;
          subscription_downloads_remaining: number;
          subscription_downloads_reset_at: string | null;
          subscription_plan: BillingPlan;
          subscription_status: BillingStatus;
          subscription_order_id: string | null;
          subscription_current_period_ends_at: string | null;
          pro_since: string | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          billing_email?: string | null;
          is_pro?: boolean;
          plan?: string;
          subscription_downloads_remaining?: number;
          subscription_downloads_reset_at?: string | null;
          subscription_plan?: BillingPlan;
          subscription_status?: BillingStatus;
          subscription_order_id?: string | null;
          subscription_current_period_ends_at?: string | null;
          pro_since?: string | null;
          updated_at?: string;
        };
        Update: {
          billing_email?: string | null;
          is_pro?: boolean;
          plan?: string;
          subscription_downloads_remaining?: number;
          subscription_downloads_reset_at?: string | null;
          subscription_plan?: BillingPlan;
          subscription_status?: BillingStatus;
          subscription_order_id?: string | null;
          subscription_current_period_ends_at?: string | null;
          pro_since?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: number;
          user_id: string;
          provider: string;
          external_subscription_id: string;
          external_customer_id: string | null;
          product_id: string | null;
          status: string;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          provider: string;
          external_subscription_id: string;
          external_customer_id?: string | null;
          product_id?: string | null;
          status?: string;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          provider?: string;
          external_subscription_id?: string;
          external_customer_id?: string | null;
          product_id?: string | null;
          status?: string;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      skill_purchases: {
        Row: {
          id: number;
          user_id: string;
          skill_id: string;
          provider: string;
          external_order_id: string | null;
          price: number;
          source: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          skill_id: string;
          provider: string;
          external_order_id?: string | null;
          price?: number;
          source?: string;
        };
        Update: {
          user_id?: string;
          skill_id?: string;
          provider?: string;
          external_order_id?: string | null;
          price?: number;
          source?: string;
        };
        Relationships: [];
      };
      billing_orders: {
        Row: {
          order_id: string;
          user_id: string | null;
          buyer_email: string | null;
          product_id: string | null;
          product_type: string;
          product_name: string | null;
          currency: string | null;
          amount: number | null;
          tax_amount: number | null;
          status: string;
          environment: string | null;
          event_id: string | null;
          metadata: Json;
          paid_at: string | null;
          updated_at: string;
        };
        Insert: {
          order_id: string;
          user_id?: string | null;
          buyer_email?: string | null;
          product_id?: string | null;
          product_type: string;
          product_name?: string | null;
          currency?: string | null;
          amount?: number | null;
          tax_amount?: number | null;
          status: string;
          environment?: string | null;
          event_id?: string | null;
          metadata?: Json;
          paid_at?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string | null;
          buyer_email?: string | null;
          product_id?: string | null;
          product_type?: string;
          product_name?: string | null;
          currency?: string | null;
          amount?: number | null;
          tax_amount?: number | null;
          status?: string;
          environment?: string | null;
          event_id?: string | null;
          metadata?: Json;
          paid_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

let adminClient:
  | ReturnType<typeof createClient<Database>>
  | null = null;

export function createSupabaseAdmin() {
  if (!adminClient) {
    adminClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  return adminClient;
}
