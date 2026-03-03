-- ============================================================
-- Step 1.1: Add points column to profiles
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS points integer DEFAULT 0 NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_points ON public.profiles(points DESC);

-- ============================================================
-- Step 1.2: Create point_action enum and point_transactions table
-- ============================================================

DO $$ BEGIN
  CREATE TYPE point_action AS ENUM (
    'signup_bonus',
    'skill_create', 'skill_create_first', 'skill_update',
    'skill_downloaded',
    'pr_submit', 'pr_merged_author', 'pr_merged_reviewer',
    'skill_liked', 'skill_unliked'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.point_transactions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action point_action NOT NULL,
  points integer NOT NULL,
  ref_id text,
  ref_type text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_point_tx_user ON public.point_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_point_tx_daily ON public.point_transactions(user_id, action, created_at);

ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Step 1.2b: RLS policy for point_transactions
-- ============================================================

DO $$ BEGIN
  CREATE POLICY "Users can view own transactions"
    ON public.point_transactions FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- Step 1.3: RPC function to award points (SECURITY DEFINER)
-- ============================================================

CREATE OR REPLACE FUNCTION public.award_points_to_user(
  target_user_id uuid,
  p_action point_action,
  p_points integer,
  p_ref_id text DEFAULT NULL,
  p_ref_type text DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO public.point_transactions (user_id, action, points, ref_id, ref_type)
  VALUES (target_user_id, p_action, p_points, p_ref_id, p_ref_type);

  UPDATE public.profiles
  SET points = GREATEST(points + p_points, 0)
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
