# Database Setup for LogiFun

## Problem

User baru tidak bisa login karena tabel `public.user_profiles` tidak ada di database. Error dari Supabase:

```
ERROR: relation "public.user_profiles" does not exist (SQLSTATE 42P01)
```

## Solution

Jalankan migrasi database untuk membuat semua tabel yang diperlukan.

## How to Run Migration

### Option 1: Supabase Dashboard (Recommended)

1. Buka **Supabase Dashboard**
2. Pilih project Anda
3. Pergi ke **SQL Editor**
4. Copy dan paste isi dari `supabase/migrations/003_complete_schema.sql`
5. Klik **Run** untuk eksekusi

### Option 2: Supabase CLI (jika sudah setup)

```bash
# Dari root directory project
supabase db push
```

## What This Migration Creates

### 1. **user_profiles** table

- Menyimpan informasi profil user (nama, email, avatar, provider)
- Otomatis dibuat saat user baru signup
- Linked ke `auth.users` table

### 2. **Assessment Tables**

- `user_learning_progress` - Progress belajar per materi
- `user_quiz_scores` - Skor kuis
- `user_game_scores` - Skor game
- `user_statistics` - Statistik overall user

### 3. **Security**

- Row Level Security (RLS) enabled
- User hanya bisa akses data mereka sendiri
- Proper indexes untuk performance

### 4. **Triggers**

- Auto-create profile saat user baru signup
- Auto-update statistics saat ada activity baru
- Auto-update profile saat user data berubah

## Verification

Setelah menjalankan migration, verifikasi dengan query ini di SQL Editor:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_profiles', 'user_learning_progress', 'user_quiz_scores', 'user_game_scores', 'user_statistics');

-- Check if triggers exist
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

## Expected Result

Setelah migration berhasil:

- ✅ User baru bisa login dengan Google
- ✅ Profile otomatis dibuat saat signup
- ✅ Tidak ada error "user_profiles does not exist"
- ✅ Assessment system berfungsi normal
