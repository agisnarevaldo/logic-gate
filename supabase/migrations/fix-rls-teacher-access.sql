-- Fix RLS Policies for Teacher Access
-- Run this in Supabase SQL Editor
-- Enable RLS on user_profiles if not already enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might be blocking teacher access
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

-- Create new policies that allow:
-- 1. Users can read their own profile
-- 2. Teachers can read all student profiles
-- 3. Users can update their own profile
-- Policy for users to read their own profile
CREATE POLICY "Users can read own profile" ON public.user_profiles FOR
SELECT
    USING (auth.uid () = id);

-- Policy for teachers to read all student profiles
CREATE POLICY "Teachers can read all profiles" ON public.user_profiles FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                public.user_profiles teacher_profile
            WHERE
                teacher_profile.id = auth.uid ()
                AND teacher_profile.role = 'teacher'
        )
    );

-- Policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR
UPDATE USING (auth.uid () = id);

-- Also ensure proper policies for other teacher-accessed tables
-- user_statistics table
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own statistics" ON public.user_statistics;

DROP POLICY IF EXISTS "Teachers can read all statistics" ON public.user_statistics;

CREATE POLICY "Users can read own statistics" ON public.user_statistics FOR
SELECT
    USING (auth.uid () = user_id);

CREATE POLICY "Teachers can read all statistics" ON public.user_statistics FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                public.user_profiles teacher_profile
            WHERE
                teacher_profile.id = auth.uid ()
                AND teacher_profile.role = 'teacher'
        )
    );

-- user_quiz_scores table
ALTER TABLE public.user_quiz_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own quiz scores" ON public.user_quiz_scores;

DROP POLICY IF EXISTS "Teachers can read all quiz scores" ON public.user_quiz_scores;

CREATE POLICY "Users can read own quiz scores" ON public.user_quiz_scores FOR
SELECT
    USING (auth.uid () = user_id);

CREATE POLICY "Teachers can read all quiz scores" ON public.user_quiz_scores FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                public.user_profiles teacher_profile
            WHERE
                teacher_profile.id = auth.uid ()
                AND teacher_profile.role = 'teacher'
        )
    );

-- user_game_scores table  
ALTER TABLE public.user_game_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own game scores" ON public.user_game_scores;

DROP POLICY IF EXISTS "Teachers can read all game scores" ON public.user_game_scores;

CREATE POLICY "Users can read own game scores" ON public.user_game_scores FOR
SELECT
    USING (auth.uid () = user_id);

CREATE POLICY "Teachers can read all game scores" ON public.user_game_scores FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                public.user_profiles teacher_profile
            WHERE
                teacher_profile.id = auth.uid ()
                AND teacher_profile.role = 'teacher'
        )
    );

-- user_learning_progress table
ALTER TABLE public.user_learning_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own learning progress" ON public.user_learning_progress;

DROP POLICY IF EXISTS "Teachers can read all learning progress" ON public.user_learning_progress;

CREATE POLICY "Users can read own learning progress" ON public.user_learning_progress FOR
SELECT
    USING (auth.uid () = user_id);

CREATE POLICY "Teachers can read all learning progress" ON public.user_learning_progress FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                public.user_profiles teacher_profile
            WHERE
                teacher_profile.id = auth.uid ()
                AND teacher_profile.role = 'teacher'
        )
    );

-- Verify the policies are working
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
    AND tablename IN (
        'user_profiles',
        'user_statistics',
        'user_quiz_scores',
        'user_game_scores',
        'user_learning_progress'
    )
ORDER BY
    tablename,
    policyname;