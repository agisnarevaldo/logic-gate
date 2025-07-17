# Progression System Implementation Guide

## Overview

Sistem progression telah berhasil diimplementasikan dengan pendekatan semi-game seperti Duolingo yang fun dan engaging. Sistem ini memungkinkan user untuk belajar secara bertahap (step-by-step) dengan fitur unlock materi dan quiz berdasarkan progress.

## 🎯 Fitur Utama

### 1. **Step-by-Step Learning**
- ✅ User harus menyelesaikan materi secara berurutan (level 1 → 2 → 3 → dst)
- ✅ Materi level berikutnya terkunci sampai level sebelumnya selesai
- ✅ Visual indication (locked/unlocked/completed) yang jelas

### 2. **Progressive Quiz System**
- ✅ Quiz terkunci sampai materi prerequisite selesai
- ✅ Quiz harus dimulai dari level mudah dulu baru bisa ke level berikutnya
- ✅ Sistem grading dengan minimum passing score (70%)

### 3. **Gamification Elements**
- ✅ XP (Experience Points) system
- ✅ Streak tracking (consecutive learning days)
- ✅ Achievement system dengan badge
- ✅ Visual progress indicators dan animasi

### 4. **Fun & Engaging UI/UX**
- ✅ Duolingo-inspired design dengan colors & animations
- ✅ Level badges dan progress indicators
- ✅ Sparkle effects untuk achievements
- ✅ Gradient backgrounds dan hover effects

## 📁 File Structure

```
src/
├── hooks/
│   └── useProgression.ts           # Main progression hook
├── services/
│   └── progression.ts              # Backend service
├── types/
│   └── progression.ts              # TypeScript types
├── components/
│   └── progression/
│       ├── progression-path.tsx    # Main progression component
│       ├── progression-item.tsx    # Individual item (material/quiz)
│       ├── progression-stats.tsx   # User stats display
│       └── achievement-card.tsx    # Achievement components
├── app/
│   ├── progression/
│   │   └── page.tsx               # Progression overview page
│   ├── materi/
│   │   ├── page.tsx               # Materials list (progression-aware)
│   │   └── [slug]/page.tsx        # Individual material (progression-aware)
│   ├── kuis/
│   │   └── page.tsx               # Quiz list (progression-aware)
│   └── dashboard/
│       └── page.tsx               # Dashboard with progression card
```

## 🔗 Database Schema

### Tables Created:
1. **user_progress** - Main user progression data
2. **learning_materials** - Material definitions
3. **quiz_config** - Quiz configurations
4. **user_activity_log** - Activity tracking
5. **achievements** - Available achievements
6. **user_achievements** - User-earned achievements

## 🎮 User Flow

### Material Learning Flow:
1. User mengakses `/materi`
2. Melihat daftar materi dengan status (locked/available/completed)
3. Hanya bisa mengakses materi yang unlocked
4. Setelah membaca materi, click "Selesaikan Materi" → dapatkan XP
5. Materi level berikutnya otomatis unlock

### Quiz Flow:
1. User mengakses `/kuis`
2. Melihat daftar quiz dengan status berdasarkan progress
3. Quiz terkunci sampai prerequisite material/quiz selesai
4. Submit quiz → update score & progression
5. Jika lulus (≥70%) → unlock quiz level berikutnya + dapatkan XP

### Progression Overview:
1. User mengakses `/progression`
2. Melihat jalur pembelajaran lengkap dengan visual progress
3. Stats: Total XP, streak, completed materials/quizzes
4. Recent achievements dengan sparkle effects
5. Clear indicators untuk next steps

## 🛠️ Technical Implementation

### 1. **useProgression Hook**
```typescript
const { 
  userProgress,           // User progress data
  progressionState,       // Complete progression state
  isLoading,             // Loading state
  error,                 // Error state
  refreshProgress,       // Refresh function
  completeMaterial,      // Mark material complete
  completeQuiz,          // Mark quiz complete
  getProgressPercentage, // Calculate overall progress
  getCurrentStreak,      // Get current streak
  getTotalXP            // Get total XP
} = useProgression();
```

### 2. **Progression Service**
- `getUserProgress()` - Get/create user progress
- `getProgressionState()` - Get complete state with lock status
- `completeMaterial(slug)` - Mark material complete + award XP
- `completeQuiz(code, score, percentage)` - Mark quiz complete + award XP
- `updateProgress(update)` - Update progression via RPC function

### 3. **Lock/Unlock Logic**
```typescript
// Material unlock logic
const isMaterialUnlocked = (material: LearningMaterial, userProgress: UserProgress) => {
  // Check prerequisite level completed
  if (material.prerequisite_level && 
      !userProgress.completed_materials.includes(material.prerequisite_level)) {
    return false;
  }
  
  // Check if within unlocked level
  return material.level <= userProgress.material_level;
};

// Quiz unlock logic  
const isQuizUnlocked = (quiz: QuizConfig, userProgress: UserProgress) => {
  // Check material prerequisite
  if (!userProgress.completed_materials.includes(quiz.unlock_material_level)) {
    return false;
  }
  
  // Check quiz prerequisite
  if (quiz.prerequisite_quiz && 
      !userProgress.passed_quizzes.includes(quiz.prerequisite_quiz)) {
    return false;
  }
  
  return true;
};
```

## 🎨 Design Elements

### Color Scheme:
- **Unlocked/Available**: Blue gradient (`bg-blue-50 border-blue-200`)
- **Completed**: Green (`bg-green-50 border-green-200`)  
- **Locked**: Gray (`bg-gray-50 border-gray-200`)
- **Failed Quiz**: Red (`bg-red-50 border-red-200`)

### Icons:
- **Material Available**: `<BookOpen />` (blue)
- **Material Completed**: `<CheckCircle />` (green)
- **Quiz Available**: `<Brain />` (purple)
- **Quiz Passed**: `<Trophy />` (yellow)
- **Quiz Failed**: `<Target />` (red)
- **Locked**: `<Lock />` (gray)

### Animations:
- Hover effects pada cards
- Sparkle animations untuk achievements
- Progress bar transitions
- Loading states dengan spinners

## 🔧 Step-by-Step Setup Instructions

### 1. **Database Setup (REQUIRED)**

**Step 1: Jalankan Schema SQL Files**
1. Buka Supabase Dashboard → SQL Editor
2. Jalankan file-file ini secara berurutan:

   ```sql
   -- 1. Jalankan supabase-academic-scoring-schema.sql
   -- (File ini sudah dijalankan sebelumnya untuk academic scoring)
   
   -- 2. Jalankan progression-system-schema.sql
   -- Copy dan paste seluruh isi file, lalu execute
   
   -- 3. Jalankan progression-sample-data.sql  
   -- Copy dan paste seluruh isi file, lalu execute
   ```

**Step 2: Verifikasi Setup**
```sql
-- Check if all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_progress', 'learning_materials', 'quiz_config', 'achievements');

-- Check sample data
SELECT 'Learning Materials' as table_name, COUNT(*) as count FROM learning_materials
UNION ALL
SELECT 'Quiz Config', COUNT(*) FROM quiz_config  
UNION ALL
SELECT 'Achievements', COUNT(*) FROM achievements;
```

Hasil yang diharapkan:
- 4 tables exist
- 5 learning materials
- 4 quiz configs  
- 8 achievements

### 2. **Application Setup**
Pastikan Supabase connection sudah dikonfigurasi di:
- `src/lib/supabase/client.ts`
- Environment variables untuk Supabase

### 3. **Navigation Setup**
Tambahkan link progression ke navigation menu di `sidebar-menu.tsx`:
```typescript
{ href: '/progression', label: 'Jalur Pembelajaran', icon: <Sparkles /> }
```

## 📊 Monitoring & Analytics

### User Progress Tracking:
- Total XP earned
- Streak days
- Completion rates per material/quiz
- Time spent on learning
- Achievement unlock patterns

### Performance Metrics:
- User engagement rates
- Drop-off points dalam progression
- Average completion times
- Success rates per quiz level

## 🚀 Next Steps & Enhancements

### Phase 2 Features:
1. **Advanced Gamification**
   - Leaderboards
   - Daily challenges
   - Multiplier bonuses untuk streaks
   - Seasonal events & limited-time achievements

2. **Adaptive Learning**
   - AI-powered difficulty adjustment
   - Personalized learning paths
   - Smart retry recommendations
   - Weakness analysis & targeted practice

3. **Social Features**
   - Study groups
   - Peer comparisons
   - Sharing achievements
   - Collaborative challenges

4. **Enhanced Analytics**
   - Learning pattern analysis
   - Predictive recommendations
   - Progress forecasting
   - Detailed performance insights

## 🐛 Troubleshooting

### Common Issues:

1. **Error creating user progress ({})**
   ```sql
   -- Pastikan tabel user_progress ada dan memiliki RLS policy yang benar
   -- Jalankan progression-system-schema.sql di Supabase SQL Editor
   -- Lalu jalankan progression-sample-data.sql untuk data sampel
   
   -- Check if tables exist:
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('user_progress', 'learning_materials', 'quiz_config');
   
   -- Check RLS policies:
   SELECT schemaname, tablename, policyname, cmd 
   FROM pg_policies 
   WHERE tablename IN ('user_progress', 'learning_materials', 'quiz_config');
   ```

2. **RLS Policy Errors (406)**
   ```sql
   -- Run fix-topic-progress-rls.sql if needed
   -- Pastikan user authenticated saat akses database
   ```

3. **Progression Not Loading**
   ```typescript
   // Check useProgression hook error state
   console.log(error); // Debug error messages
   // Check browser console for detailed error logs
   ```

4. **Material/Quiz Not Unlocking**
   ```typescript
   // Verify completion status di database
   // Check prerequisite logic di progression service
   ```

5. **Empty Materials/Quiz Lists**
   ```sql
   -- Pastikan data sampel sudah diinsert
   -- Jalankan progression-sample-data.sql
   SELECT COUNT(*) FROM learning_materials WHERE is_active = true;
   SELECT COUNT(*) FROM quiz_config WHERE is_active = true;
   ```

### Setup Verification:

1. **Check Database Tables**
   ```sql
   -- Verify all tables exist
   \dt
   -- Or in Supabase SQL Editor:
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```

2. **Check Sample Data**
   ```sql
   -- Verify sample data exists
   SELECT 'Learning Materials' as table_name, COUNT(*) as count FROM learning_materials
   UNION ALL
   SELECT 'Quiz Config', COUNT(*) FROM quiz_config
   UNION ALL
   SELECT 'Achievements', COUNT(*) FROM achievements;
   ```

3. **Check User Authentication**
   ```typescript
   // In browser console, check if user is authenticated
   const { data: { user } } = await supabase.auth.getUser();
   console.log('User:', user);
   ```

## 📝 Testing Checklist

### User Stories Testing:
- [ ] ✅ User bisa lihat materi terkunci vs unlocked
- [ ] ✅ User harus selesaikan materi level 1 sebelum akses level 2
- [ ] ✅ Quiz terkunci sampai prerequisite material selesai
- [ ] ✅ User dapatkan XP setelah selesaikan materi/quiz
- [ ] ✅ Streak tracking berfungsi dengan benar
- [ ] ✅ Achievement unlock sesuai requirements
- [ ] ✅ Progress percentage calculation akurat
- [ ] ✅ Visual indicators (badges, stars, locks) tampil benar

### Technical Testing:
- [ ] ✅ Database operations (create, read, update) berhasil
- [ ] ✅ RLS policies mencegah unauthorized access
- [ ] ✅ Error handling untuk network failures
- [ ] ✅ Loading states selama data fetch
- [ ] ✅ Responsive design di mobile & desktop

## 🎉 Implementation Complete!

Sistem progression telah berhasil diimplementasikan dengan semua fitur utama:
- ✅ Step-by-step learning flow
- ✅ Progressive quiz unlocking
- ✅ XP & gamification system
- ✅ Fun & engaging UI/UX
- ✅ Database integration
- ✅ Error handling & loading states

Aplikasi sekarang memiliki experience belajar yang structured, fun, dan engaging seperti Duolingo! 🚀
