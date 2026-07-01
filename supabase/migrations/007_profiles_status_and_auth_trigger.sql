-- ============================================================
--  007 — PROFILES STATUS (ALLOWLIST) + AUTO-CREATE ON SIGNUP
--  Adds a `status` column to separate "is this person allowed
--  in" from `role` ("what can they do once they're in").
--  Adds a trigger so every new auth.users row automatically
--  gets a matching profiles row, defaulting to 'pending'.
-- ============================================================

-- 1. Add status column
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending'
  CHECK (status = ANY (ARRAY['pending', 'approved', 'blocked']));

-- 2. Backfill: everyone who already has a profile row today
--    (i.e. created manually via the admin UI) is considered approved.
UPDATE public.profiles
SET status = 'approved'
WHERE status = 'pending';

-- 3. Auto-create a profile row whenever a new auth.users row appears
--    (covers Google OAuth sign-in and email/password sign-up alike).
--    New self-signups default to 'pending' via the column default.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NULL,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Index for quick lookups when gating dashboard access
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles (status);