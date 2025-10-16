-- Simple teacher account creation for testing
-- Run this in Supabase SQL Editor
-- Create teacher account manually
INSERT INTO
    auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_sent_at,
        confirmation_token,
        recovery_sent_at,
        recovery_token,
        email_change_sent_at,
        email_change,
        email_change_token_new,
        email_change_token_current,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        email_change_confirm_status,
        banned_until,
        reauthentication_token,
        reauthentication_sent_at,
        is_sso_user,
        deleted_at
    )
VALUES
    (
        gen_random_uuid (),
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'guru@logifun.com',
        crypt ('GuruLogiFun2025!', gen_salt ('bf')),
        NOW (),
        NOW (),
        '',
        NULL,
        '',
        NULL,
        '',
        '',
        '',
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Guru LogiFun"}',
        FALSE,
        NOW (),
        NOW (),
        NULL,
        NULL,
        '',
        '',
        NULL,
        0,
        NULL,
        '',
        NULL,
        FALSE,
        NULL
    );

-- Get the teacher user ID
SELECT
    id,
    email
FROM
    auth.users
WHERE
    email = 'guru@logifun.com';

-- Add role column to user_profiles if not exists
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher'));

-- Update the profile to teacher role
UPDATE public.user_profiles
SET
    role = 'teacher',
    full_name = 'Guru LogiFun'
WHERE
    id = (
        SELECT
            id
        FROM
            auth.users
        WHERE
            email = 'guru@logifun.com'
    );

-- Verify the teacher account
SELECT
    up.id,
    up.email,
    up.role,
    up.full_name
FROM
    public.user_profiles up
WHERE
    up.email = 'guru@logifun.com';