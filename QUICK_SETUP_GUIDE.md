# 🚀 QUICK SETUP GUIDE - Progression System

## Error yang Anda alami: "Error creating user progress"

Ini terjadi karena tabel database belum dibuat atau data sampel belum diinsert. Ikuti langkah berikut:

## ✅ Langkah-langkah Perbaikan:

### 1. **Setup Database (WAJIB)**

**Buka Supabase Dashboard → SQL Editor**, lalu jalankan file-file ini secara berurutan:

#### File 1: `progression-system-schema.sql`
```sql
-- Copy & paste seluruh isi file progression-system-schema.sql
-- Lalu klik "Run" atau Ctrl+Enter
```

#### File 2: `progression-sample-data.sql`  
```sql
-- Copy & paste seluruh isi file progression-sample-data.sql
-- Lalu klik "Run" atau Ctrl+Enter
```

### 2. **Verifikasi Setup**
Jalankan query ini di SQL Editor untuk memastikan setup berhasil:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_progress', 'learning_materials', 'quiz_config', 'achievements');

-- Check data
SELECT 'Learning Materials' as table_name, COUNT(*) as count FROM learning_materials
UNION ALL
SELECT 'Quiz Config', COUNT(*) FROM quiz_config  
UNION ALL
SELECT 'Achievements', COUNT(*) FROM achievements;
```

**Expected Results:**
- ✅ 4 tables found
- ✅ 5 learning materials  
- ✅ 4 quiz configs
- ✅ 8 achievements

### 3. **Test Aplikasi**
1. Restart development server: `npm run dev`
2. Login ke aplikasi
3. Buka halaman `/progression`
4. Error seharusnya sudah hilang!

## 🎯 Fitur yang Bisa Dicoba:

### Dashboard
- ✨ Card "Jalur Pembelajaran" dengan gradient background

### Halaman `/progression`  
- 📊 Progress stats (XP, streak, completed items)
- 📚 Materials dengan status locked/unlocked/completed
- 🧠 Quizzes dengan prerequisite system
- 🏆 Achievement tracking

### Halaman `/materi`
- 🔒 Step-by-step unlocking (level 1 → 2 → 3)
- ✅ Completion tracking dengan XP reward
- 🎨 Visual status indicators

### Halaman `/kuis`
- 🔒 Quiz unlocking berdasarkan completed materials
- 🎯 Difficulty levels dan passing scores
- ⭐ XP rewards untuk quiz completion

## 🎮 User Flow Testing:

1. **Start Fresh** - Login sebagai user baru
2. **Material 1** - Buka materi level 1, klik "Selesaikan Materi" → dapatkan XP
3. **Material 2** - Level 2 sekarang unlocked
4. **Quiz 1** - Setelah materi 1 selesai, quiz 1 unlocked
5. **Progression** - Check progress di halaman `/progression`

## 🐛 Jika Masih Error:

1. **Check Console** - Buka Developer Tools → Console untuk error details
2. **Check Authentication** - Pastikan user sudah login
3. **Check Database Connection** - Pastikan Supabase credentials benar

## 📁 Files yang Sudah Dibuat:

```
✅ SQL Files:
- progression-system-schema.sql
- progression-sample-data.sql

✅ Components:
- src/hooks/useProgression.ts
- src/services/progression.ts  
- src/types/progression.ts
- src/components/progression/
- src/app/progression/page.tsx

✅ Updated Pages:
- src/app/dashboard/page.tsx
- src/app/materi/page.tsx
- src/app/kuis/page.tsx
```

## 🎉 Expected Result:

Setelah setup database selesai, Anda akan memiliki:
- ✨ Duolingo-style learning progression
- 🎮 Gamification dengan XP & achievements  
- 🔒 Step-by-step content unlocking
- 📊 Progress tracking & analytics
- 🎨 Beautiful, engaging UI

**Happy Learning! 🚀**
