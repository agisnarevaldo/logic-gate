-- Fix RLS policies to prevent infinite recursion
-- Run this in Supabase SQL Editor
-- First, drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Teachers can view all student profiles" ON public.user_profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR
SELECT
    USING (auth.uid () = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles FOR
UPDATE USING (auth.uid () = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT
WITH
    CHECK (auth.uid () = id);

-- Teacher policy - simple check without joining back to user_profiles
CREATE POLICY "Teachers can view all profiles" ON public.user_profiles FOR
SELECT
    USING (
        -- Allow if it's their own profile
        auth.uid () = id
        OR
        -- Allow if user has teacher role (check auth.jwt() instead of user_profiles)
        (auth.jwt () - > > 'role' = 'teacher')
    );

-- Alternative: If jwt approach doesn't work, we can use a function
-- CREATE OR REPLACE FUNCTION is_teacher(user_id UUID)
-- RETURNS BOOLEAN AS $$
-- BEGIN
--   RETURN EXISTS (
--     SELECT 1 FROM public.user_profiles 
--     WHERE id = user_id AND role = 'teacher'
--   );
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
-- Then use: is_teacher(auth.uid()) instead of the subquery