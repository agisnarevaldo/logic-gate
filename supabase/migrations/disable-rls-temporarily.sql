-- Quick Fix: Disable RLS temporarily for development
-- Run this in Supabase SQL Editor
-- Disable RLS on user_profiles table
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on related tables to prevent similar issues
ALTER TABLE public.user_statistics DISABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_quiz_scores DISABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_game_scores DISABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_learning_progress DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM
    pg_tables
WHERE
    schemaname = 'public'
    AND tablename IN (
        'user_profiles',
        'user_statistics',
        'user_quiz_scores',
        'user_game_scores',
        'user_learning_progress'
    );

-- This should show rowsecurity = false for all tables