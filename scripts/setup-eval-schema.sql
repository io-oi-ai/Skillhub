-- ============================================================
-- Skill Eval schema
-- ============================================================

-- Step 1: Eval cases table
CREATE TABLE IF NOT EXISTS public.skill_eval_cases (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  skill_id text REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  input text NOT NULL,
  expected text NOT NULL,
  rules jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skill_eval_cases_skill_id
  ON public.skill_eval_cases(skill_id);

-- Step 2: Eval runs table
CREATE TABLE IF NOT EXISTS public.skill_eval_runs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  skill_id text REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  case_id bigint REFERENCES public.skill_eval_cases(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('pass', 'fail', 'unknown')),
  reason text,
  output text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skill_eval_runs_skill_id
  ON public.skill_eval_runs(skill_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_eval_runs_case_id
  ON public.skill_eval_runs(case_id, created_at DESC);

-- Step 3: RLS
ALTER TABLE public.skill_eval_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_eval_runs ENABLE ROW LEVEL SECURITY;

-- Read policies: everyone can read eval cases/runs
DO $$ BEGIN
  CREATE POLICY "Eval cases are public"
    ON public.skill_eval_cases FOR SELECT
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Eval runs are public"
    ON public.skill_eval_runs FOR SELECT
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Write policy: only skill owner can insert eval cases
DO $$ BEGIN
  CREATE POLICY "Skill owners can insert eval cases"
    ON public.skill_eval_cases FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.skills s
        WHERE s.id = skill_id AND s.user_id = auth.uid()
      )
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Write policy: only skill owner can insert eval runs (server/CLI)
DO $$ BEGIN
  CREATE POLICY "Skill owners can insert eval runs"
    ON public.skill_eval_runs FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.skills s
        WHERE s.id = skill_id AND s.user_id = auth.uid()
      )
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
