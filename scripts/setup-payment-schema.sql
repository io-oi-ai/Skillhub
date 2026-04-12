-- ============================================================================
-- SkillHub Payment Schema Setup
-- ============================================================================
-- This script sets up the payment-related database schema for SkillHub.
-- Run this AFTER setup-auth-schema.sql and setup-points-schema.sql.
--
-- Sections:
--   1. profiles table — add plan + subscription fields
--   2. skills table — add pricing fields
--   3. subscriptions table
--   4. skill_purchases table
--   5. Indexes
--   6. RLS policies
-- ============================================================================


-- ============================================================================
-- 1. Profiles table — add plan and subscription download fields
-- ============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free' NOT NULL;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_downloads_remaining integer DEFAULT 0;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_downloads_reset_at timestamptz;


-- ============================================================================
-- 2. Skills table — add pricing fields
-- ----------------------------------------------------------------------------
-- price_type: 'free' (default) or 'paid'
-- price: amount in cents (USD). 0 means free.
-- ============================================================================

ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS price_type text DEFAULT 'free' NOT NULL;

ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS price integer DEFAULT 0;

ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS waffo_product_id text;

ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS creem_product_id text;


-- ============================================================================
-- 3. Subscriptions table
-- ----------------------------------------------------------------------------
-- Unified table for both Creem and Waffo subscriptions.
-- The 'provider' column distinguishes between them.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL,                          -- 'creem' | 'waffo'
  external_subscription_id text UNIQUE NOT NULL,   -- creem subscription ID or waffo order ID
  external_customer_id text,                       -- creem customer ID or waffo email
  product_id text,
  status text DEFAULT 'active' NOT NULL,           -- active | canceled | expired | past_due
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);


-- ============================================================================
-- 4. Skill purchases table
-- ----------------------------------------------------------------------------
-- Records individual skill purchases (one-time buy) and subscription downloads.
-- UNIQUE(user_id, skill_id) ensures each user can only "own" a skill once.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.skill_purchases (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id text REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL,                          -- 'creem' | 'waffo' | 'subscription'
  external_order_id text,                          -- payment provider order/checkout ID
  price integer NOT NULL DEFAULT 0,                -- actual amount paid in cents
  source text NOT NULL DEFAULT 'purchase',         -- 'purchase' | 'subscription'
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);


-- ============================================================================
-- 5. Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id
  ON public.subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_skill_purchases_user_id
  ON public.skill_purchases(user_id);

CREATE INDEX IF NOT EXISTS idx_skill_purchases_skill_id
  ON public.skill_purchases(skill_id);

CREATE INDEX IF NOT EXISTS idx_skills_price_type
  ON public.skills(price_type);


-- ============================================================================
-- 6. RLS policies
-- ----------------------------------------------------------------------------
-- subscriptions: users can only view their own subscriptions.
-- skill_purchases: users can only view their own purchases.
-- Write operations are performed by the service role (webhook handlers).
-- ============================================================================

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

ALTER TABLE public.skill_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON public.skill_purchases FOR SELECT
  USING (auth.uid() = user_id);
