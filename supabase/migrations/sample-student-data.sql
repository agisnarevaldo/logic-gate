-- Student data seeder for testing teacher dashboard
-- Run this AFTER creating teacher account

-- Sample students with various progress levels
DO $$
DECLARE
    student1_id UUID := gen_random_uuid();
    student2_id UUID := gen_random_uuid();
    student3_id UUID := gen_random_uuid();
BEGIN
    -- Insert sample students
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
        created_at, updated_at
    ) VALUES 
    (student1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
     'andi@test.com', crypt('password123', gen_salt('bf')), NOW(), 
     '{"provider": "email", "providers": ["email"]}', '{"full_name": "Andi Pratama"}', 
     NOW(), NOW()),
    (student2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
     'budi@test.com', crypt('password123', gen_salt('bf')), NOW(), 
     '{"provider": "email", "providers": ["email"]}', '{"full_name": "Budi Santoso"}', 
     NOW(), NOW()),
    (student3_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
     'citra@test.com', crypt('password123', gen_salt('bf')), NOW(), 
     '{"provider": "email", "providers": ["email"]}', '{"full_name": "Citra Dewi"}', 
     NOW(), NOW());

    -- Insert into user_profiles with student role
    INSERT INTO public.user_profiles (id, email, full_name, role, created_at, updated_at) VALUES
    (student1_id, 'andi@test.com', 'Andi Pratama', 'student', NOW(), NOW()),
    (student2_id, 'budi@test.com', 'Budi Santoso', 'student', NOW(), NOW()),
    (student3_id, 'citra@test.com', 'Citra Dewi', 'student', NOW(), NOW());

    -- Sample quiz scores
    INSERT INTO public.user_quiz_scores (user_id, quiz_id, quiz_title, score, completed_at) VALUES
    (student1_id, 'quiz-1', 'Basic Logic Gates', 85, NOW() - INTERVAL '2 days'),
    (student1_id, 'quiz-2', 'AND & OR Gates', 92, NOW() - INTERVAL '1 day'),
    (student2_id, 'quiz-1', 'Basic Logic Gates', 78, NOW() - INTERVAL '3 days'),
    (student2_id, 'quiz-2', 'AND & OR Gates', 88, NOW() - INTERVAL '2 days'),
    (student2_id, 'quiz-3', 'NAND & NOR Gates', 94, NOW() - INTERVAL '1 day'),
    (student3_id, 'quiz-1', 'Basic Logic Gates', 95, NOW() - INTERVAL '1 day');

    -- Sample game scores
    INSERT INTO public.user_game_scores (user_id, game_id, game_title, score, completed_at) VALUES
    (student1_id, 'game-1', 'Logic Puzzle Challenge', 75, NOW() - INTERVAL '2 days'),
    (student1_id, 'game-2', 'Gate Builder', 88, NOW() - INTERVAL '1 day'),
    (student2_id, 'game-1', 'Logic Puzzle Challenge', 82, NOW() - INTERVAL '3 days'),
    (student2_id, 'game-2', 'Gate Builder', 91, NOW() - INTERVAL '2 days'),
    (student3_id, 'game-1', 'Logic Puzzle Challenge', 89, NOW() - INTERVAL '1 day'),
    (student3_id, 'game-2', 'Gate Builder', 93, NOW() - INTERVAL '6 hours');

    -- Sample learning progress
    INSERT INTO public.user_learning_progress (user_id, material_id, material_title, progress, status, last_accessed_at) VALUES
    (student1_id, 'mat-1', 'Pengenalan Logic Gates', 100, 'completed', NOW() - INTERVAL '3 days'),
    (student1_id, 'mat-2', 'AND & OR Operations', 100, 'completed', NOW() - INTERVAL '2 days'),
    (student1_id, 'mat-3', 'NAND & NOR Operations', 65, 'in_progress', NOW() - INTERVAL '1 day'),
    (student2_id, 'mat-1', 'Pengenalan Logic Gates', 100, 'completed', NOW() - INTERVAL '4 days'),
    (student2_id, 'mat-2', 'AND & OR Operations', 100, 'completed', NOW() - INTERVAL '3 days'),
    (student2_id, 'mat-3', 'NAND & NOR Operations', 100, 'completed', NOW() - INTERVAL '2 days'),
    (student2_id, 'mat-4', 'XOR & XNOR Gates', 80, 'in_progress', NOW() - INTERVAL '1 day'),
    (student3_id, 'mat-1', 'Pengenalan Logic Gates', 100, 'completed', NOW() - INTERVAL '2 days'),
    (student3_id, 'mat-2', 'AND & OR Operations', 85, 'in_progress', NOW() - INTERVAL '1 day');

    -- Sample user statistics
    INSERT INTO public.user_statistics (user_id, current_level, total_points, materials_completed, quizzes_completed, games_completed, last_activity, created_at, updated_at) VALUES
    (student1_id, 'Dasar', 1250, 2, 2, 2, NOW() - INTERVAL '1 day', NOW(), NOW()),
    (student2_id, 'Menengah', 1850, 3, 3, 2, NOW() - INTERVAL '1 day', NOW(), NOW()),
    (student3_id, 'Dasar', 980, 1, 1, 2, NOW() - INTERVAL '6 hours', NOW(), NOW());

    RAISE NOTICE 'Sample student data created:';
    RAISE NOTICE '1. Andi Pratama (andi@test.com) - Level Dasar';
    RAISE NOTICE '2. Budi Santoso (budi@test.com) - Level Menengah';
    RAISE NOTICE '3. Citra Dewi (citra@test.com) - Level Dasar';
    RAISE NOTICE 'All passwords: password123';
END $$;
