-- Fix teacher account data to resolve login error
-- Run this in Supabase SQL Editor

-- The error occurs because some columns in auth.users have NULL values
-- when they should have empty strings. Let's fix the teacher account.

-- First, let's see the current teacher account data
SELECT 
    id, 
    email, 
    email_change, 
    email_change_token_new, 
    email_change_token_current,
    phone_change,
    phone_change_token,
    recovery_token,
    confirmation_token
FROM auth.users 
WHERE email = 'guru@logifun.com';

-- Fix NULL values in auth.users for teacher account
UPDATE auth.users 
SET 
    email_change = COALESCE(email_change, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    phone_change = COALESCE(phone_change, ''),
    phone_change_token = COALESCE(phone_change_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    confirmation_token = COALESCE(confirmation_token, ''),
    reauthentication_token = COALESCE(reauthentication_token, ''),
    email_change_confirm_status = COALESCE(email_change_confirm_status, 0),
    phone_confirmed_at = NULL,
    recovery_sent_at = NULL,
    email_change_sent_at = NULL,
    phone_change_sent_at = NULL,
    confirmation_sent_at = NULL,
    reauthentication_sent_at = NULL,
    banned_until = NULL,
    deleted_at = NULL
WHERE email = 'guru@logifun.com';

-- If the teacher account doesn't exist or has issues, recreate it properly
DO $$
DECLARE
    teacher_exists BOOLEAN;
    teacher_user_id UUID;
BEGIN
    -- Check if teacher account exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'guru@logifun.com') INTO teacher_exists;
    
    IF NOT teacher_exists THEN
        RAISE NOTICE 'Teacher account does not exist, creating new one...';
        
        -- Insert teacher user with proper NULL handling
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
        
        -- Ensure profile exists and has teacher role
        INSERT INTO public.user_profiles (id, email, full_name, role, created_at, updated_at)
        VALUES (teacher_user_id, 'guru@logifun.com', 'Guru LogiFun', 'teacher', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
            role = 'teacher',
            full_name = 'Guru LogiFun',
            updated_at = NOW();
            
        RAISE NOTICE 'New teacher account created with ID: %', teacher_user_id;
    ELSE
        -- Get existing teacher ID
        SELECT id INTO teacher_user_id FROM auth.users WHERE email = 'guru@logifun.com';
        
        -- Ensure profile has teacher role
        INSERT INTO public.user_profiles (id, email, full_name, role, created_at, updated_at)
        VALUES (teacher_user_id, 'guru@logifun.com', 'Guru LogiFun', 'teacher', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
            role = 'teacher',
            full_name = 'Guru LogiFun',
            updated_at = NOW();
            
        RAISE NOTICE 'Existing teacher account fixed with ID: %', teacher_user_id;
    END IF;
    
    RAISE NOTICE 'Teacher login: guru@logifun.com / GuruLogiFun2025!';
END $$;

-- Verify the fix worked
SELECT 
    'Teacher account verification:' as status,
    u.id,
    u.email,
    u.email_change,
    u.email_change_token_new,
    u.confirmation_token,
    p.role,
    p.full_name
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE u.email = 'guru@logifun.com';
