-- Fix RLS Policy untuk topic_progress table
-- Jalankan script ini di Supabase SQL Editor jika masih ada error 406

-- Drop existing policies jika ada
DROP POLICY IF EXISTS "Users can view their own topic progress" ON topic_progress;
DROP POLICY IF EXISTS "Users can insert their own topic progress" ON topic_progress;
DROP POLICY IF EXISTS "Users can update their own topic progress" ON topic_progress;

-- Recreate policies dengan kondisi yang lebih permissive
CREATE POLICY "Enable all access for authenticated users own data" ON topic_progress
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Alternative: Separate policies untuk setiap operasi
-- CREATE POLICY "Users can select their own topic progress" ON topic_progress
--     FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert their own topic progress" ON topic_progress
--     FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update their own topic progress" ON topic_progress
--     FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can delete their own topic progress" ON topic_progress
--     FOR DELETE USING (auth.uid() = user_id);

-- Verify policies
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'topic_progress';

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'topic_progress';
