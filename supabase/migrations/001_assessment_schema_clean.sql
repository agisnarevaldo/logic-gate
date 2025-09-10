-- Database schema for assessment and learning progress tracking
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store user learning progress for each material
CREATE TABLE IF NOT EXISTS user_learning_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
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

-- Table to store quiz scores and results
CREATE TABLE IF NOT EXISTS user_quiz_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
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

-- Table to store game scores and results
CREATE TABLE IF NOT EXISTS user_game_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
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

-- Table to store overall user statistics and achievements
CREATE TABLE IF NOT EXISTS user_statistics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_user_id ON user_learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_status ON user_learning_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_quiz_scores_user_id ON user_quiz_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_scores_completed_at ON user_quiz_scores(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_game_scores_user_id ON user_game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_game_scores_completed_at ON user_game_scores(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_statistics_user_id ON user_statistics(user_id);

-- Create triggers to automatically update user_statistics when scores are added
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update statistics based on the table that triggered this function
  IF TG_TABLE_NAME = 'user_quiz_scores' THEN
    INSERT INTO user_statistics (user_id, total_quizzes_completed, best_quiz_score, total_score, updated_at)
    VALUES (NEW.user_id, 1, NEW.score, NEW.score, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      total_quizzes_completed = user_statistics.total_quizzes_completed + 1,
      best_quiz_score = GREATEST(user_statistics.best_quiz_score, NEW.score),
      total_score = user_statistics.total_score + NEW.score,
      updated_at = NOW();
      
  ELSIF TG_TABLE_NAME = 'user_game_scores' THEN
    INSERT INTO user_statistics (user_id, total_games_completed, best_game_score, total_score, updated_at)
    VALUES (NEW.user_id, 1, NEW.score, NEW.score, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      total_games_completed = user_statistics.total_games_completed + 1,
      best_game_score = GREATEST(user_statistics.best_game_score, NEW.score),
      total_score = user_statistics.total_score + NEW.score,
      updated_at = NOW();
      
  ELSIF TG_TABLE_NAME = 'user_learning_progress' AND NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO user_statistics (user_id, total_materials_completed, updated_at)
    VALUES (NEW.user_id, 1, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      total_materials_completed = user_statistics.total_materials_completed + 1,
      updated_at = NOW();
  END IF;
  
  -- Update current level based on materials completed
  IF TG_TABLE_NAME = 'user_learning_progress' THEN
    UPDATE user_statistics 
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
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_stats_quiz ON user_quiz_scores;
CREATE TRIGGER trigger_update_stats_quiz
  AFTER INSERT ON user_quiz_scores
  FOR EACH ROW EXECUTE FUNCTION update_user_statistics();

DROP TRIGGER IF EXISTS trigger_update_stats_game ON user_game_scores;
CREATE TRIGGER trigger_update_stats_game
  AFTER INSERT ON user_game_scores
  FOR EACH ROW EXECUTE FUNCTION update_user_statistics();

DROP TRIGGER IF EXISTS trigger_update_stats_progress ON user_learning_progress;
CREATE TRIGGER trigger_update_stats_progress
  AFTER INSERT OR UPDATE ON user_learning_progress
  FOR EACH ROW EXECUTE FUNCTION update_user_statistics();

-- Create RLS (Row Level Security) policies
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can view own learning progress" ON user_learning_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning progress" ON user_learning_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning progress" ON user_learning_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own quiz scores" ON user_quiz_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz scores" ON user_quiz_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own game scores" ON user_game_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game scores" ON user_game_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own statistics" ON user_statistics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own statistics" ON user_statistics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own statistics" ON user_statistics
  FOR UPDATE USING (auth.uid() = user_id);
