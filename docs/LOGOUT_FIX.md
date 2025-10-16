# Fix Logout Issue

## Problem

Logout button tidak berfungsi karena:

1. RLS policies causing infinite recursion
2. Session tidak di-clear dengan benar

## Solution

### 1. Fix Database RLS Policies (URGENT)

Jalankan SQL berikut di **Supabase SQL Editor**:

```sql
-- Fix RLS policies to prevent infinite recursion
-- Run this in Supabase SQL Editor

-- First, drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Teachers can view all student profiles" ON public.user_profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Teacher policy - simple check without joining back to user_profiles
CREATE POLICY "Teachers can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    -- Allow if it's their own profile
    auth.uid() = id
    OR
    -- Allow if user has teacher role (check auth.jwt() instead of user_profiles)
    (auth.jwt() ->> 'role' = 'teacher')
  );
```

### 2. Code Changes Applied

- ✅ Fixed `signOut` function to properly clear session
- ✅ Added loading states to logout buttons
- ✅ Clear localStorage/sessionStorage on logout
- ✅ Force page reload after logout

### 3. Test Steps

1. Run the SQL fix above in Supabase
2. Refresh browser
3. Try logout button
4. Should redirect to /login page

### 4. If Still Not Working

Alternative approach - temporarily disable RLS:

```sql
-- Temporary fix - disable RLS for testing
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
```

**Remember to re-enable RLS after fixing:**

```sql
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
```
