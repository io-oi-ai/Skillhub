-- Add bio and website columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website text DEFAULT NULL;

-- Add download_count to skills table
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS download_count integer DEFAULT 0;

-- RPC to atomically increment download_count
CREATE OR REPLACE FUNCTION public.increment_download_count(skill_id text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.skills
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = skill_id;
$$;
