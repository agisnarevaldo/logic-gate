-- Fix Infinite Recursion in RLS Policies
-- Run this in Supabase SQL Editor
-- First, drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Teachers can read all profiles" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

-- Create simpler, non-recursive policies
-- Policy 1: Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.user_profiles FOR
SELECT
    USING (auth.uid () = id);

-- Policy 2: Teachers can read all profiles (using direct role check, not subquery)
-- We'll use a simpler approach - allow access if the requesting user's email contains 'guru'
-- or if we can directly check the role without causing recursion
CREATE POLICY "Teachers can read all student profiles" ON public.user_profiles FOR
SELECT
    USING (
        -- Allow if it's the user's own profile
        auth.uid () = id
        OR
        -- Allow if the authenticated user's email contains 'guru' (teacher identifier)
        (
            SELECT
                auth.jwt () - > > 'email'
        ) LIKE '%guru%'
    );

-- Policy 3: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR
UPDATE USING (auth.uid () = id);

-- Alternative approach: If the above still causes issues, we can disable RLS temporarily
-- for testing and re-enable with a different strategy
-- Check if policies are created correctly
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM
    pg_policies
WHERE
    schemaname = 'public'
    AND tablename = 'user_profiles'
ORDER BY
    policyname;

-- If we still have issues, we can try this alternative:
-- Temporarily disable RLS for user_profiles to test
-- ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
-- Or create a more permissive policy for development
-- DROP POLICY IF EXISTS "Allow all authenticated users" ON public.user_profiles;
-- CREATE POLICY "Allow all authenticated users" ON public.user_profiles
--     FOR ALL USING (auth.role() = 'authenticated');