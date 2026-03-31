-- ============================================================================
-- SkillHub Billing Schema Setup
-- ============================================================================
-- Adds billing and subscription state to user profiles and records orders from
-- Waffo Pancake webhooks.
-- Run this after scripts/setup-auth-schema.sql.
-- ============================================================================

alter table public.profiles
  add column if not exists billing_email text,
  add column if not exists is_pro boolean not null default false,
  add column if not exists subscription_plan text not null default 'free',
  add column if not exists subscription_status text not null default 'inactive',
  add column if not exists subscription_order_id text,
  add column if not exists subscription_current_period_ends_at timestamptz,
  add column if not exists pro_since timestamptz,
  add column if not exists updated_at timestamptz not null default now();

alter table public.profiles
  drop constraint if exists profiles_subscription_plan_check;

alter table public.profiles
  add constraint profiles_subscription_plan_check
  check (subscription_plan in ('free', 'pro_monthly', 'pro_yearly'));

alter table public.profiles
  drop constraint if exists profiles_subscription_status_check;

alter table public.profiles
  add constraint profiles_subscription_status_check
  check (subscription_status in ('inactive', 'active', 'canceling', 'canceled', 'past_due'));

create unique index if not exists idx_profiles_billing_email
  on public.profiles (billing_email)
  where billing_email is not null;

create table if not exists public.billing_orders (
  id bigint generated always as identity primary key,
  order_id text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  buyer_email text,
  product_id text,
  product_type text not null,
  product_name text,
  currency text,
  amount integer,
  tax_amount integer,
  status text not null,
  environment text,
  event_id text,
  metadata jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_billing_orders_user_id
  on public.billing_orders(user_id);

create index if not exists idx_billing_orders_buyer_email
  on public.billing_orders(buyer_email);

create index if not exists idx_billing_orders_status
  on public.billing_orders(status);

alter table public.billing_orders enable row level security;

drop policy if exists "Users can view own billing orders" on public.billing_orders;
create policy "Users can view own billing orders"
  on public.billing_orders for select
  using (auth.uid() = user_id);
