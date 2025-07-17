-- Progression System Database Schema
-- Execute this in Supabase SQL Editor

-- User progress tracking table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    
    -- Progress tracking
    material_level INTEGER DEFAULT 1,           -- Current unlocked material level (1-5)
    quiz_level INTEGER DEFAULT 0,               -- Current unlocked quiz level (0-4)
    completed_materials INTEGER[] DEFAULT ARRAY[],  -- [1,2,3] = completed levels
    passed_quizzes TEXT[] DEFAULT ARRAY[],          -- ['GATE_SYMBOLS', 'BASIC_GATES']
    
    -- Gamification
    total_xp INTEGER DEFAULT 0,                 -- Experience points
    streak_days INTEGER DEFAULT 0,             -- Consecutive days of learning
    last_activity DATE DEFAULT CURRENT_DATE,   -- Last learning activity
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material content table (defines learning path)
CREATE TABLE learning_materials (
    id INTEGER PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    level INTEGER NOT NULL,                     -- 1-5 progression level
    description TEXT,
    duration_minutes INTEGER DEFAULT 10,       -- Estimated reading time
    xp_reward INTEGER DEFAULT 10,              -- XP for completion
    prerequisite_level INTEGER,                -- Required previous level
    content_type VARCHAR(20) DEFAULT 'reading', -- reading, interactive, video
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz configuration table (enhanced)
CREATE TABLE quiz_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_code VARCHAR(20) UNIQUE NOT NULL,     -- GATE_SYMBOLS, BASIC_GATES, etc.
    title VARCHAR(100) NOT NULL,
    level INTEGER NOT NULL,                    -- 1-4 progression level  
    unlock_material_level INTEGER NOT NULL,   -- Required material level to unlock
    prerequisite_quiz VARCHAR(20),            -- Required previous quiz code
    passing_score INTEGER DEFAULT 70,         -- Minimum score to pass
    xp_reward_pass INTEGER DEFAULT 50,        -- XP for passing
    xp_reward_perfect INTEGER DEFAULT 100,    -- XP for 95%+ score
    estimated_time_minutes INTEGER DEFAULT 5,
    difficulty VARCHAR(20) DEFAULT 'medium',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert learning materials data
INSERT INTO learning_materials (id, title, slug, level, description, duration_minutes, prerequisite_level) VALUES
(1, 'Pengenalan Gerbang Logika', 'introduction', 1, 'Memahami konsep dasar gerbang logika dan pentingnya dalam dunia digital', 15, NULL),
(2, 'Gerbang Logika Dasar', 'basic-gates', 2, 'Mempelajari gerbang AND, OR, dan NOT beserta cara kerjanya', 20, 1),
(3, 'Gerbang Logika Turunan', 'advanced-gates', 3, 'Memahami NAND, NOR, XOR, dan XNOR serta aplikasinya', 25, 2),
(4, 'Tabel Kebenaran', 'truth-tables', 4, 'Belajar membuat dan membaca tabel kebenaran untuk berbagai gerbang', 20, 3),
(5, 'Aplikasi dan Rangkaian', 'applications', 5, 'Penerapan gerbang logika dalam rangkaian digital nyata', 30, 4);

-- Insert quiz configuration data
INSERT INTO quiz_config (quiz_code, title, level, unlock_material_level, prerequisite_quiz, passing_score, estimated_time_minutes) VALUES
('GATE_SYMBOLS', 'Simbol Gerbang Logika', 1, 1, NULL, 70, 5),
('BASIC_GATES', 'Gerbang Logika Dasar', 2, 2, 'GATE_SYMBOLS', 70, 10),
('ADVANCED_GATES', 'Gerbang Logika Turunan', 3, 3, 'BASIC_GATES', 75, 10),
('TRUTH_TABLE', 'Tabel Kebenaran', 4, 4, 'ADVANCED_GATES', 80, 12);

-- User activity log for streaks
CREATE TABLE user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(20) NOT NULL,        -- 'material_read', 'quiz_completed'
    reference_id VARCHAR(50),                  -- material slug or quiz code
    xp_earned INTEGER DEFAULT 0,
    activity_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievement/Badge system
CREATE TABLE achievements (
    id INTEGER PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),                          -- emoji or icon name
    requirement_type VARCHAR(20),             -- 'streak', 'xp', 'perfect_score', 'completion'
    requirement_value INTEGER,               -- threshold value
    xp_reward INTEGER DEFAULT 25,
    is_active BOOLEAN DEFAULT true
);

-- User earned achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Insert initial achievements
INSERT INTO achievements (id, code, title, description, icon, requirement_type, requirement_value) VALUES
(1, 'first_steps', 'Langkah Pertama', 'Menyelesaikan materi pertama', '🎯', 'completion', 1),
(2, 'quiz_master', 'Master Kuis', 'Lulus semua kuis dengan sempurna', '🏆', 'perfect_score', 4),
(3, 'streak_3', 'Konsisten 3 Hari', 'Belajar selama 3 hari berturut-turut', '🔥', 'streak', 3),
(4, 'streak_7', 'Dedikasi Seminggu', 'Belajar selama 7 hari berturut-turut', '⭐', 'streak', 7),
(5, 'xp_hunter', 'Pemburu XP', 'Mengumpulkan 500 XP', '💎', 'xp', 500);

-- Indexes for performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_learning_materials_level ON learning_materials(level);
CREATE INDEX idx_quiz_config_level ON quiz_config(level);
CREATE INDEX idx_user_activity_log_user_date ON user_activity_log(user_id, activity_date);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

-- RLS Policies
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies for user_progress
CREATE POLICY "Users can manage their own progress" ON user_progress
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policies for learning_materials (read-only for authenticated users)
CREATE POLICY "Learning materials are viewable by authenticated users" ON learning_materials
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policies for quiz_config (read-only for authenticated users)  
CREATE POLICY "Quiz config is viewable by authenticated users" ON quiz_config
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policies for user_activity_log
CREATE POLICY "Users can manage their own activity log" ON user_activity_log
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policies for achievements (read-only for authenticated users)
CREATE POLICY "Achievements are viewable by authenticated users" ON achievements
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert user achievements" ON user_achievements
    FOR INSERT WITH CHECK (true); -- Allow system to award achievements

-- Function to update user progress and XP
CREATE OR REPLACE FUNCTION update_user_progress(
    p_user_id UUID,
    p_activity_type VARCHAR,
    p_reference_id VARCHAR,
    p_xp_earned INTEGER DEFAULT 0,
    p_material_level INTEGER DEFAULT NULL,
    p_quiz_level INTEGER DEFAULT NULL,
    p_completed_material INTEGER DEFAULT NULL,
    p_passed_quiz TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Insert activity log
    INSERT INTO user_activity_log (user_id, activity_type, reference_id, xp_earned)
    VALUES (p_user_id, p_activity_type, p_reference_id, p_xp_earned);
    
    -- Update or create user progress
    INSERT INTO user_progress (user_id, total_xp, last_activity)
    VALUES (p_user_id, p_xp_earned, CURRENT_DATE)
    ON CONFLICT (user_id) DO UPDATE SET
        total_xp = user_progress.total_xp + p_xp_earned,
        material_level = COALESCE(p_material_level, user_progress.material_level),
        quiz_level = COALESCE(p_quiz_level, user_progress.quiz_level),
        completed_materials = CASE 
            WHEN p_completed_material IS NOT NULL AND NOT (p_completed_material = ANY(user_progress.completed_materials))
            THEN array_append(user_progress.completed_materials, p_completed_material)
            ELSE user_progress.completed_materials
        END,
        passed_quizzes = CASE
            WHEN p_passed_quiz IS NOT NULL AND NOT (p_passed_quiz = ANY(user_progress.passed_quizzes))
            THEN array_append(user_progress.passed_quizzes, p_passed_quiz)
            ELSE user_progress.passed_quizzes
        END,
        last_activity = CURRENT_DATE,
        updated_at = NOW();
        
    -- Update streak if learning today
    UPDATE user_progress 
    SET streak_days = CASE
        WHEN last_activity = CURRENT_DATE - INTERVAL '1 day' THEN streak_days + 1
        WHEN last_activity = CURRENT_DATE THEN streak_days
        ELSE 1
    END
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
