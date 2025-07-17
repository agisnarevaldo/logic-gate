-- Insert sample data for progression system testing
-- Execute this after running the main schema files

-- Insert learning materials (matching existing app structure)
INSERT INTO learning_materials (id, title, slug, level, description, duration_minutes, xp_reward, prerequisite_level, content_type) VALUES
(1, 'Pengenalan Logic Gate', 'pengenalan-logic-gate', 1, 'Memahami dasar-dasar gerbang logika dan penggunaannya dalam elektronika digital', 15, 50, NULL, 'reading'),
(2, 'Gerbang Logika Dasar', 'gerbang-logika-dasar', 2, 'Mempelajari gerbang AND, OR, dan NOT sebagai fondasi logic gate', 20, 75, 1, 'reading'),
(3, 'Gerbang Logika Turunan', 'gerbang-logika-turunan', 3, 'Memahami NAND, NOR, XOR, dan XNOR yang merupakan kombinasi gerbang dasar', 25, 100, 2, 'reading'),
(4, 'Tabel Kebenaran', 'tabel-kebenaran', 4, 'Analisis lengkap tabel kebenaran untuk berbagai kombinasi gerbang logika', 20, 125, 3, 'reading'),
(5, 'Aplikasi Praktis', 'aplikasi-praktis', 5, 'Implementasi gerbang logika dalam kehidupan nyata dan teknologi modern', 30, 150, 4, 'reading')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    level = EXCLUDED.level,
    description = EXCLUDED.description,
    duration_minutes = EXCLUDED.duration_minutes,
    xp_reward = EXCLUDED.xp_reward,
    prerequisite_level = EXCLUDED.prerequisite_level,
    content_type = EXCLUDED.content_type;

-- Insert quiz configurations
INSERT INTO quiz_config (quiz_code, title, level, unlock_material_level, prerequisite_quiz, passing_score, xp_reward_pass, xp_reward_perfect, estimated_time_minutes, difficulty) VALUES
('GATE_SYMBOLS', 'Simbol Gerbang Logika', 1, 1, NULL, 70, 50, 100, 5, 'easy'),
('BASIC_GATES', 'Gerbang Logika Dasar', 2, 2, 'GATE_SYMBOLS', 70, 75, 150, 10, 'medium'),
('ADVANCED_GATES', 'Gerbang Logika Turunan', 3, 3, 'BASIC_GATES', 70, 100, 200, 10, 'medium'),
('TRUTH_TABLE', 'Tabel Kebenaran', 4, 4, 'ADVANCED_GATES', 70, 125, 250, 12, 'hard')
ON CONFLICT (quiz_code) DO UPDATE SET
    title = EXCLUDED.title,
    level = EXCLUDED.level,
    unlock_material_level = EXCLUDED.unlock_material_level,
    prerequisite_quiz = EXCLUDED.prerequisite_quiz,
    passing_score = EXCLUDED.passing_score,
    xp_reward_pass = EXCLUDED.xp_reward_pass,
    xp_reward_perfect = EXCLUDED.xp_reward_perfect,
    estimated_time_minutes = EXCLUDED.estimated_time_minutes,
    difficulty = EXCLUDED.difficulty;

-- Insert sample achievements
INSERT INTO achievements (title, description, requirement_type, requirement_value, badge_icon, badge_color) VALUES
('First Steps', 'Selesaikan materi pertama', 'completion', 1, '🚀', '#3B82F6'),
('Knowledge Seeker', 'Selesaikan 3 materi', 'completion', 3, '📚', '#10B981'),
('Logic Master', 'Selesaikan semua materi', 'completion', 5, '🎓', '#8B5CF6'),
('Point Collector', 'Kumpulkan 100 XP', 'xp', 100, '💰', '#F59E0B'),
('Experience Hunter', 'Kumpulkan 500 XP', 'xp', 500, '💎', '#EF4444'),
('Consistent Learner', 'Belajar 3 hari berturut-turut', 'streak', 3, '🔥', '#F97316'),
('Dedicated Student', 'Belajar 7 hari berturut-turut', 'streak', 7, '⚡', '#06B6D4'),
('Perfect Score', 'Raih skor sempurna dalam quiz', 'perfect_score', 1, '⭐', '#84CC16')
ON CONFLICT (title) DO UPDATE SET
    description = EXCLUDED.description,
    requirement_type = EXCLUDED.requirement_type,
    requirement_value = EXCLUDED.requirement_value,
    badge_icon = EXCLUDED.badge_icon,
    badge_color = EXCLUDED.badge_color;

-- Verify data insertion
SELECT 'Learning Materials' as table_name, COUNT(*) as row_count FROM learning_materials
UNION ALL
SELECT 'Quiz Config' as table_name, COUNT(*) as row_count FROM quiz_config
UNION ALL  
SELECT 'Achievements' as table_name, COUNT(*) as row_count FROM achievements;
