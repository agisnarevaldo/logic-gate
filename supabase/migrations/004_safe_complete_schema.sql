-- SAFE Complete database schema for LogiFun application
-- This version handles existing tables/policies/functions gracefully
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USER PROFILES TABLE (SAFE VERSION)
-- =============================================
-- Only create if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
        CREATE TABLE public.user_profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email VARCHAR(255) UNIQUE NOT NULL,
            full_name VARCHAR(255),
            avatar_url TEXT,
            provider VARCHAR(50), -- 'google', 'email', etc.
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created table: user_profiles';
    ELSE
        RAISE NOTICE 'Table user_profiles already exists, skipping...';
    END IF;
END
$$;

-- =============================================
-- 2. ASSESSMENT TABLES (SAFE VERSION)
-- =============================================
-- Create assessment tables only if they don't exist
CREATE TABLE IF NOT EXISTS public.user_learning_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_id VARCHAR(50) NOT NULL,
  material_title VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'locked')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, material_id)
);

CREATE TABLE IF NOT EXISTS public.user_quiz_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id VARCHAR(50) NOT NULL,
  quiz_title VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  time_taken INTEGER, -- in seconds
  grade VARCHAR(2) CHECK (grade IN ('A', 'B', 'C', 'D', 'F')),
  details JSONB, -- store detailed answers and question breakdown
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_game_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id VARCHAR(50) NOT NULL,
  game_title VARCHAR(255) NOT NULL,
  game_type VARCHAR(20) NOT NULL CHECK (game_type IN ('challenge', 'guess', 'simulator')),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  level_reached INTEGER DEFAULT 1,
  lives_remaining INTEGER DEFAULT 0,
  time_taken INTEGER, -- in seconds
  details JSONB, -- store game-specific data like challenges completed, etc.
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_statistics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0,
  total_quizzes_completed INTEGER DEFAULT 0,
  total_games_completed INTEGER DEFAULT 0,
  total_materials_completed INTEGER DEFAULT 0,
  best_quiz_score INTEGER DEFAULT 0,
  best_game_score INTEGER DEFAULT 0,
  current_level VARCHAR(20) DEFAULT 'Pemula',
  total_study_time INTEGER DEFAULT 0, -- in minutes
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  achievements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. INDEXES (SAFE VERSION)
-- =============================================
-- Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_user_id ON public.user_learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_status ON public.user_learning_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_quiz_scores_user_id ON public.user_quiz_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_scores_completed_at ON public.user_quiz_scores(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_game_scores_user_id ON public.user_game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_game_scores_completed_at ON public.user_game_scores(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_statistics_user_id ON public.user_statistics(user_id);

-- =============================================
-- 4. ROW LEVEL SECURITY (SAFE VERSION)
-- =============================================
-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate them
DO $$
DECLARE
    policy_names TEXT[] := ARRAY[
        'Users can view own profile',
        'Users can update own profile', 
        'Users can insert own profile',
        'Users can view own learning progress',
        'Users can insert own learning progress',
        'Users can update own learning progress',
        'Users can view own quiz scores',
        'Users can insert own quiz scores',
        'Users can view own game scores', 
        'Users can insert own game scores',
        'Users can view own statistics',
        'Users can insert own statistics',
        'Users can update own statistics'
    ];
    table_names TEXT[] := ARRAY[
        'user_profiles', 'user_profiles', 'user_profiles',
        'user_learning_progress', 'user_learning_progress', 'user_learning_progress',
        'user_quiz_scores', 'user_quiz_scores',
        'user_game_scores', 'user_game_scores', 
        'user_statistics', 'user_statistics', 'user_statistics'
    ];
    i INTEGER;
BEGIN
    FOR i IN 1..array_length(policy_names, 1) LOOP
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_names[i], table_names[i]);
        EXCEPTION WHEN OTHERS THEN
            -- Ignore errors when dropping non-existent policies
            NULL;
        END;
    END LOOP;
END
$$;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own learning progress" ON public.user_learning_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning progress" ON public.user_learning_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning progress" ON public.user_learning_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own quiz scores" ON public.user_quiz_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz scores" ON public.user_quiz_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own game scores" ON public.user_game_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game scores" ON public.user_game_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own statistics" ON public.user_statistics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own statistics" ON public.user_statistics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own statistics" ON public.user_statistics
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 5. FUNCTIONS (SAFE VERSION)
-- =============================================
-- Clean up existing functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS trigger_update_stats_quiz ON public.user_quiz_scores;
DROP TRIGGER IF EXISTS trigger_update_stats_game ON public.user_game_scores;
DROP TRIGGER IF EXISTS trigger_update_stats_progress ON public.user_learning_progress;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_update() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_statistics() CASCADE;

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url, provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Error creating user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_profiles 
  SET 
    email = NEW.email,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', full_name),
    avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', avatar_url),
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Error updating user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'user_quiz_scores' THEN
    INSERT INTO public.user_statistics (user_id, total_quizzes_completed, best_quiz_score, total_score, updated_at)
    VALUES (NEW.user_id, 1, NEW.score, NEW.score, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      total_quizzes_completed = public.user_statistics.total_quizzes_completed + 1,
      best_quiz_score = GREATEST(public.user_statistics.best_quiz_score, NEW.score),
      total_score = public.user_statistics.total_score + NEW.score,
      updated_at = NOW();
      
  ELSIF TG_TABLE_NAME = 'user_game_scores' THEN
    INSERT INTO public.user_statistics (user_id, total_games_completed, best_game_score, total_score, updated_at)
    VALUES (NEW.user_id, 1, NEW.score, NEW.score, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      total_games_completed = public.user_statistics.total_games_completed + 1,
      best_game_score = GREATEST(public.user_statistics.best_game_score, NEW.score),
      total_score = public.user_statistics.total_score + NEW.score,
      updated_at = NOW();
      
  ELSIF TG_TABLE_NAME = 'user_learning_progress' AND NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO public.user_statistics (user_id, total_materials_completed, updated_at)
    VALUES (NEW.user_id, 1, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      total_materials_completed = public.user_statistics.total_materials_completed + 1,
      updated_at = NOW();
  END IF;
  
  IF TG_TABLE_NAME = 'user_learning_progress' THEN
    UPDATE public.user_statistics 
    SET current_level = CASE 
      WHEN total_materials_completed >= 7 THEN 'Ahli'
      WHEN total_materials_completed >= 4 THEN 'Menengah' 
      WHEN total_materials_completed >= 2 THEN 'Dasar'
      ELSE 'Pemula'
    END,
    updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Error updating user statistics for user %: %', NEW.user_id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 6. TRIGGERS (SAFE VERSION)
-- =============================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

CREATE TRIGGER trigger_update_stats_quiz
  AFTER INSERT ON public.user_quiz_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_user_statistics();

CREATE TRIGGER trigger_update_stats_game
  AFTER INSERT ON public.user_game_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_user_statistics();

CREATE TRIGGER trigger_update_stats_progress
  AFTER INSERT OR UPDATE ON public.user_learning_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_user_statistics();

-- =============================================
-- 7. VERIFICATION
-- =============================================
-- Show what was created
DO $$
BEGIN
  RAISE NOTICE '=== DATABASE SETUP COMPLETE ===';
  RAISE NOTICE 'Tables created/verified:';
  RAISE NOTICE '- user_profiles';
  RAISE NOTICE '- user_learning_progress'; 
  RAISE NOTICE '- user_quiz_scores';
  RAISE NOTICE '- user_game_scores';
  RAISE NOTICE '- user_statistics';
  RAISE NOTICE '';
  RAISE NOTICE 'Triggers created:';
  RAISE NOTICE '- on_auth_user_created';
  RAISE NOTICE '- on_auth_user_updated';
  RAISE NOTICE '- trigger_update_stats_quiz';
  RAISE NOTICE '- trigger_update_stats_game';
  RAISE NOTICE '- trigger_update_stats_progress';
  RAISE NOTICE '';
  RAISE NOTICE 'Ready for user authentication!';
END
$$;
