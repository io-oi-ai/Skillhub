-- ============================================================================
-- SkillHub Auth Schema Setup
-- ============================================================================
-- This script sets up the authentication-related database schema for SkillHub.
-- It should be run against a Supabase project that already has the base
-- `public.skills` table in place.
--
-- Sections:
--   1. profiles table
--   2. Auto-create profile trigger
--   3. profiles RLS policies
--   4. Add user_id to skills table
--   5. skills RLS policies
--   6. skill_versions table
--   7. skill_pull_requests table
-- ============================================================================


-- ============================================================================
-- 1. Profiles table
-- ----------------------------------------------------------------------------
-- Public user profile linked to Supabase auth.users. One row per signed-up
-- user, referenced by every piece of user-generated content.
-- ============================================================================

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);


-- ============================================================================
-- 2. Auto-create profile trigger
-- ----------------------------------------------------------------------------
-- Automatically inserts a profiles row whenever a new user signs up via
-- Supabase Auth. Username and display name are derived from OAuth metadata
-- or from the email prefix as a fallback.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'user_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================================
-- 3. Profiles RLS policies
-- ----------------------------------------------------------------------------
-- Everyone can view any profile. Users can only update their own row.
-- ============================================================================

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);


-- ============================================================================
-- 4. Add user_id column to skills table
-- ----------------------------------------------------------------------------
-- Links each skill to the user who created it. Nullable so that existing
-- rows (created before auth was added) are not broken.
-- ============================================================================

alter table public.skills
  add column if not exists user_id uuid references public.profiles(id) on delete set null;


-- ============================================================================
-- 5. Skills RLS policies
-- ----------------------------------------------------------------------------
-- Anyone can read skills. Only authenticated users can create skills (and
-- user_id must match their own). Authors can update their own skills.
-- ============================================================================

alter table public.skills enable row level security;

create policy "Skills are viewable by everyone"
  on public.skills for select using (true);

create policy "Authenticated users can create skills"
  on public.skills for insert with check (auth.uid() = user_id);

create policy "Authors can update own skills"
  on public.skills for update using (auth.uid() = user_id);


-- ============================================================================
-- 6. Skill versions table
-- ----------------------------------------------------------------------------
-- Immutable history of every published version of a skill. Each row captures
-- a full snapshot of the skill content at a point in time.
-- ============================================================================

create table public.skill_versions (
  id bigint generated always as identity primary key,
  skill_id text references public.skills(id) on delete cascade not null,
  version text not null,
  name text not null,
  description text not null,
  content text not null,
  roles text[] default '{}',
  scenes text[] default '{}',
  tags text[] default '{}',
  user_id uuid references public.profiles(id) on delete set null,
  message text,
  created_at timestamptz default now()
);

create index idx_skill_versions_skill_id
  on public.skill_versions(skill_id);

create index idx_skill_versions_created_at
  on public.skill_versions(skill_id, created_at desc);

alter table public.skill_versions enable row level security;

create policy "Versions are viewable by everyone"
  on public.skill_versions for select using (true);

create policy "Authenticated users can create versions"
  on public.skill_versions for insert with check (auth.uid() = user_id);


-- ============================================================================
-- 7. Pull requests table
-- ----------------------------------------------------------------------------
-- Community-driven change proposals for skills. Authors submit a PR with
-- proposed content; the skill owner can merge or reject it.
-- ============================================================================

create type pr_status as enum ('open', 'merged', 'rejected');

create table public.skill_pull_requests (
  id bigint generated always as identity primary key,
  skill_id text references public.skills(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete set null not null,
  status pr_status default 'open' not null,
  title text not null,
  message text,
  name text not null,
  description text not null,
  content text not null,
  roles text[] default '{}',
  scenes text[] default '{}',
  tags text[] default '{}',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_comment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_skill_prs_skill_id
  on public.skill_pull_requests(skill_id);

create index idx_skill_prs_status
  on public.skill_pull_requests(skill_id, status);

create index idx_skill_prs_author
  on public.skill_pull_requests(author_id);

alter table public.skill_pull_requests enable row level security;

create policy "PRs are viewable by everyone"
  on public.skill_pull_requests for select using (true);

create policy "Authenticated users can create PRs"
  on public.skill_pull_requests for insert with check (auth.uid() = author_id);

create policy "PR authors can update own open PRs"
  on public.skill_pull_requests for update using (auth.uid() = author_id and status = 'open');
