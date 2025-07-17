-- Schema untuk sistem penilaian akademik
-- Tambahkan tabel ini ke database Supabase

-- Tabel untuk menyimpan jenis quiz/assessment
CREATE TABLE quiz_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    max_score INTEGER DEFAULT 100,
    passing_score INTEGER DEFAULT 60,
    time_limit_minutes INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel untuk menyimpan hasil quiz siswa
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_type_id UUID REFERENCES quiz_types(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL, -- Skor yang diperoleh
    max_possible_score INTEGER NOT NULL, -- Skor maksimum yang mungkin
    percentage DECIMAL(5,2) GENERATED ALWAYS AS (ROUND((score / max_possible_score) * 100, 2)) STORED,
    grade VARCHAR(2), -- A, B, C, D, F
    time_taken_seconds INTEGER,
    correct_answers INTEGER,
    total_questions INTEGER,
    detailed_results JSONB, -- Menyimpan detail jawaban per soal
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel untuk statistik pembelajaran per user
CREATE TABLE user_learning_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total_quizzes_taken INTEGER DEFAULT 0,
    total_score DECIMAL(10,2) DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    highest_score DECIMAL(5,2) DEFAULT 0,
    total_time_spent_seconds INTEGER DEFAULT 0,
    mastery_level VARCHAR(20) DEFAULT 'beginner',
    last_activity TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel untuk melacak progress per topik
CREATE TABLE topic_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_code VARCHAR(50) NOT NULL,
    mastery_percentage DECIMAL(5,2) DEFAULT 0,
    attempts_count INTEGER DEFAULT 0,
    best_score DECIMAL(5,2) DEFAULT 0,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, topic_code)
);

-- Insert data quiz types
INSERT INTO quiz_types (name, code, description, max_score, passing_score, time_limit_minutes, difficulty_level) VALUES
('Simbol Gerbang Logika', 'GATE_SYMBOLS', 'Matching quiz untuk mencocokkan simbol gerbang logika dengan namanya', 100, 70, 5, 'beginner'),
('Gerbang Logika Dasar', 'BASIC_GATES', 'Quiz tentang gerbang AND, OR, dan NOT', 100, 75, 10, 'beginner'),
('Gerbang Logika Turunan', 'ADVANCED_GATES', 'Quiz tentang NAND, NOR, XOR, dan XNOR', 100, 75, 10, 'intermediate'),
('Tabel Kebenaran', 'TRUTH_TABLE', 'Quiz melengkapi tabel kebenaran', 100, 80, 12, 'advanced');

-- Index untuk optimasi query
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_type ON quiz_attempts(quiz_type_id);
CREATE INDEX idx_quiz_attempts_completed_at ON quiz_attempts(completed_at);
CREATE INDEX idx_topic_progress_user_topic ON topic_progress(user_id, topic_code);

-- RLS Policies
ALTER TABLE quiz_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;

-- Policy untuk quiz_types (read-only untuk semua user yang authenticated)
CREATE POLICY "Quiz types are viewable by authenticated users" ON quiz_types
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy untuk quiz_attempts (user hanya bisa akses data mereka sendiri)
CREATE POLICY "Users can view their own quiz attempts" ON quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts" ON quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz attempts" ON quiz_attempts
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy untuk user_learning_stats (user hanya bisa akses data mereka sendiri)
CREATE POLICY "Users can view their own learning stats" ON user_learning_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning stats" ON user_learning_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning stats" ON user_learning_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy untuk topic_progress (user hanya bisa akses data mereka sendiri)
CREATE POLICY "Users can view their own topic progress" ON topic_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own topic progress" ON topic_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topic progress" ON topic_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Function untuk update statistik pembelajaran
CREATE OR REPLACE FUNCTION update_learning_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user_learning_stats setelah quiz attempt completed
    INSERT INTO user_learning_stats (user_id, total_quizzes_taken, total_score, highest_score, last_activity)
    VALUES (NEW.user_id, 1, NEW.score, NEW.score, NEW.completed_at)
    ON CONFLICT (user_id) DO UPDATE SET
        total_quizzes_taken = user_learning_stats.total_quizzes_taken + 1,
        total_score = user_learning_stats.total_score + NEW.score,
        average_score = ROUND((user_learning_stats.total_score + NEW.score) / (user_learning_stats.total_quizzes_taken + 1), 2),
        highest_score = GREATEST(user_learning_stats.highest_score, NEW.score),
        last_activity = NEW.completed_at,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto-update learning stats
CREATE TRIGGER trigger_update_learning_stats
    AFTER INSERT OR UPDATE OF completed_at ON quiz_attempts
    FOR EACH ROW
    WHEN (NEW.completed_at IS NOT NULL)
    EXECUTE FUNCTION update_learning_stats();
