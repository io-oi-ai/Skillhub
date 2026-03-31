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
          subscription_plan?: BillingPlan;
          subscription_status?: BillingStatus;
          subscription_order_id?: string | null;
          subscription_current_period_ends_at?: string | null;
          pro_since?: string | null;
          updated_at?: string;
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
