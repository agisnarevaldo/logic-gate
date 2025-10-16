-- Teacher Role System Migration
-- Run this in Supabase SQL Editor after completing the base schema

-- =============================================
-- 1. ADD ROLE COLUMN TO USER_PROFILES
-- =============================================
-- Add role column with default 'student'
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student' 
CHECK (role IN ('student', 'teacher'));

-- Update existing users to have 'student' role if null
UPDATE public.user_profiles 
SET role = 'student' 
WHERE role IS NULL;

-- =============================================
-- 2. CREATE TEACHER ACCOUNT
-- =============================================
-- Insert teacher user in auth.users
-- Note: This creates the auth record, profile will be auto-created by trigger
DO $$
DECLARE
    teacher_user_id UUID;
BEGIN
    -- Insert into auth.users with proper NULL handling
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_sent_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        email_change_token_current,
        email_change_sent_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        recovery_token,
        recovery_sent_at,
        reauthentication_token,
        reauthentication_sent_at,
        email_change_confirm_status,
        banned_until,
        deleted_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        phone,
        phone_confirmed_at,
        is_sso_user
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'guru@logifun.com',
        crypt('GuruLogiFun2025!', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        NOW(),
        '',  -- confirmation_token
        '',  -- email_change
        '',  -- email_change_token_new
        '',  -- email_change_token_current
        NULL,  -- email_change_sent_at
        '',  -- phone_change
        '',  -- phone_change_token
        NULL,  -- phone_change_sent_at
        '',  -- recovery_token
        NULL,  -- recovery_sent_at
        '',  -- reauthentication_token
        NULL,  -- reauthentication_sent_at
        0,   -- email_change_confirm_status
        NULL,  -- banned_until
        NULL,  -- deleted_at
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Guru LogiFun"}',
        FALSE,  -- is_super_admin
        NULL,   -- phone
        NULL,   -- phone_confirmed_at
        FALSE   -- is_sso_user
    ) 
    RETURNING id INTO teacher_user_id;
    
    -- Update the profile to set role as teacher
    UPDATE public.user_profiles 
    SET role = 'teacher', full_name = 'Guru LogiFun'
    WHERE id = teacher_user_id;
    
    RAISE NOTICE 'Teacher account created with ID: %', teacher_user_id;
    RAISE NOTICE 'Login credentials: guru@logifun.com / GuruLogiFun2025!';
    
EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'Teacher account already exists';
    WHEN others THEN
        RAISE EXCEPTION 'Error creating teacher account: %', SQLERRM;
END
$$;

-- =============================================
-- 3. CREATE TEACHER RLS POLICIES
-- =============================================

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Teachers can view all student profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Teachers can view all student progress" ON public.user_learning_progress;
DROP POLICY IF EXISTS "Teachers can view all student quiz scores" ON public.user_quiz_scores;
DROP POLICY IF EXISTS "Teachers can view all student game scores" ON public.user_game_scores;
DROP POLICY IF EXISTS "Teachers can view all student statistics" ON public.user_statistics;

-- User profiles policies for teachers
CREATE POLICY "Teachers can view all student profiles" ON public.user_profiles
  FOR SELECT USING (
    -- Teachers can see all profiles
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'teacher'
    )
    OR
    -- Users can see their own profile
    auth.uid() = id
  );

-- Learning progress policies for teachers
CREATE POLICY "Teachers can view all student progress" ON public.user_learning_progress
  FOR SELECT USING (
    -- Teachers can see all student progress
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'teacher'
    )
    OR
    -- Students can see their own progress
    auth.uid() = user_id
  );

-- Quiz scores policies for teachers
CREATE POLICY "Teachers can view all student quiz scores" ON public.user_quiz_scores
  FOR SELECT USING (
    -- Teachers can see all student quiz scores
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'teacher'
    )
    OR
    -- Students can see their own scores
    auth.uid() = user_id
  );

-- Game scores policies for teachers
CREATE POLICY "Teachers can view all student game scores" ON public.user_game_scores
  FOR SELECT USING (
    -- Teachers can see all student game scores
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'teacher'
    )
    OR
    -- Students can see their own scores
    auth.uid() = user_id
  );

-- Statistics policies for teachers
CREATE POLICY "Teachers can view all student statistics" ON public.user_statistics
  FOR SELECT USING (
    -- Teachers can see all student statistics
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'teacher'
    )
    OR
    -- Students can see their own statistics
    auth.uid() = user_id
  );

-- =============================================
-- 4. CREATE TEACHER ANALYTICS VIEWS
-- =============================================

-- View for teacher dashboard overview
CREATE OR REPLACE VIEW public.teacher_dashboard_overview AS
SELECT 
  (SELECT COUNT(*) FROM public.user_profiles WHERE role = 'student') as total_students,
  (SELECT COUNT(*) FROM public.user_quiz_scores) as total_quizzes_completed,
  (SELECT COUNT(*) FROM public.user_game_scores) as total_games_completed,
  (SELECT COUNT(*) FROM public.user_learning_progress WHERE status = 'completed') as total_materials_completed,
  (SELECT ROUND(AVG(score), 1) FROM public.user_quiz_scores) as avg_quiz_score,
  (SELECT ROUND(AVG(score), 1) FROM public.user_game_scores) as avg_game_score;

-- View for student activities feed
CREATE OR REPLACE VIEW public.student_activities AS
WITH recent_activities AS (
  -- Recent quiz completions
  SELECT 
    uqs.user_id,
    up.full_name as student_name,
    'quiz' as activity_type,
    uqs.quiz_title as activity_name,
    uqs.score,
    uqs.completed_at as activity_date
  FROM public.user_quiz_scores uqs
  JOIN public.user_profiles up ON uqs.user_id = up.id
  WHERE up.role = 'student'
  
  UNION ALL
  
  -- Recent game completions
  SELECT 
    ugs.user_id,
    up.full_name as student_name,
    'game' as activity_type,
    ugs.game_title as activity_name,
    ugs.score,
    ugs.completed_at as activity_date
  FROM public.user_game_scores ugs
  JOIN public.user_profiles up ON ugs.user_id = up.id
  WHERE up.role = 'student'
  
  UNION ALL
  
  -- Recent learning progress
  SELECT 
    ulp.user_id,
    up.full_name as student_name,
    'material' as activity_type,
    ulp.material_title as activity_name,
    ulp.progress as score,
    ulp.last_accessed_at as activity_date
  FROM public.user_learning_progress ulp
  JOIN public.user_profiles up ON ulp.user_id = up.id
  WHERE up.role = 'student' AND ulp.status IN ('in_progress', 'completed')
)
SELECT * FROM recent_activities
ORDER BY activity_date DESC
LIMIT 50;

-- Grant access to views for teachers
GRANT SELECT ON public.teacher_dashboard_overview TO authenticated;
GRANT SELECT ON public.student_activities TO authenticated;

-- =============================================
-- 5. CREATE FUNCTIONS FOR TEACHER ANALYTICS
-- =============================================

-- Function to get student progress summary
CREATE OR REPLACE FUNCTION public.get_student_progress_summary(student_id UUID)
RETURNS TABLE (
  total_materials INTEGER,
  completed_materials INTEGER,
  in_progress_materials INTEGER,
  total_quizzes INTEGER,
  avg_quiz_score NUMERIC,
  total_games INTEGER,
  avg_game_score NUMERIC,
  current_level VARCHAR,
  last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM public.user_learning_progress WHERE user_id = student_id),
    (SELECT COUNT(*)::INTEGER FROM public.user_learning_progress WHERE user_id = student_id AND status = 'completed'),
    (SELECT COUNT(*)::INTEGER FROM public.user_learning_progress WHERE user_id = student_id AND status = 'in_progress'),
    (SELECT COUNT(*)::INTEGER FROM public.user_quiz_scores WHERE user_id = student_id),
    (SELECT ROUND(AVG(score), 1) FROM public.user_quiz_scores WHERE user_id = student_id),
    (SELECT COUNT(*)::INTEGER FROM public.user_game_scores WHERE user_id = student_id),
    (SELECT ROUND(AVG(score), 1) FROM public.user_game_scores WHERE user_id = student_id),
    (SELECT current_level FROM public.user_statistics WHERE user_id = student_id),
    (SELECT MAX(activity_date) FROM (
      SELECT completed_at as activity_date FROM public.user_quiz_scores WHERE user_id = student_id
      UNION ALL
      SELECT completed_at as activity_date FROM public.user_game_scores WHERE user_id = student_id
      UNION ALL
      SELECT last_accessed_at as activity_date FROM public.user_learning_progress WHERE user_id = student_id
    ) activities);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_student_progress_summary(UUID) TO authenticated;

-- =============================================
-- 6. INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_quiz_scores_completed_at ON public.user_quiz_scores(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_game_scores_completed_at ON public.user_game_scores(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_last_accessed ON public.user_learning_progress(last_accessed_at DESC);

-- =============================================
-- 7. VERIFICATION
-- =============================================
DO $$
BEGIN
  RAISE NOTICE '=== TEACHER SYSTEM SETUP COMPLETE ===';
  RAISE NOTICE 'Role column added to user_profiles';
  RAISE NOTICE 'Teacher account created: guru@logifun.com';
  RAISE NOTICE 'Password: GuruLogiFun2025!';
  RAISE NOTICE 'RLS policies created for teacher access';
  RAISE NOTICE 'Analytics views and functions created';
  RAISE NOTICE 'Ready for teacher dashboard implementation!';
END
$$;
