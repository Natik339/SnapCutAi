-- Run this in your Supabase Dashboard -> SQL Editor

-- Restore starter credits for existing free users who currently have 0 credits.
UPDATE public.user_profiles
SET credits = 2
WHERE plan = 'free'
  AND credits = 0;
