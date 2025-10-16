# Fix Teacher Login Error

## Problem

Teacher login gagal dengan error:

```
error finding user: sql: Scan error on column index 8, name "email_change": converting NULL to string is unsupported
```

## Root Cause

Migration `005_teacher_system.sql` tidak mengset semua kolom yang diperlukan di tabel `auth.users`. Supabase Auth mengharapkan beberapa kolom string memiliki nilai empty string (`''`) bukan `NULL`.

## Solution

### Step 1: Run Fix SQL

Jalankan script `fix-teacher-login.sql` di **Supabase SQL Editor**:

1. Buka Supabase Dashboard
2. Pilih project Anda
3. Pergi ke **SQL Editor**
4. Copy dan paste isi dari `fix-teacher-login.sql`
5. Klik **Run**

### Step 2: Verify Teacher Account

Setelah menjalankan SQL fix, verify dengan query ini:

```sql
SELECT
    u.id,
    u.email,
    p.role,
    p.full_name
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE u.email = 'guru@logifun.com';
```

### Step 3: Test Login

1. Refresh aplikasi web
2. Klik tombol "Mode Guru" di login page
3. Login dengan:
   - **Email**: guru@logifun.com
   - **Password**: GuruLogiFun2025!

## Expected Result

- ✅ Login berhasil tanpa error
- ✅ Redirect ke `/guru` (teacher dashboard)
- ✅ Role detection berfungsi (sidebar menu show "Mode Guru")

## If Still Having Issues

Jika masih ada masalah, coba delete dan recreate teacher account:

```sql
-- Delete existing teacher account
DELETE FROM public.user_profiles WHERE email = 'guru@logifun.com';
DELETE FROM auth.users WHERE email = 'guru@logifun.com';

-- Then run the fix-teacher-login.sql again
```
