# Assessment Database Setup

## Overview

Sistem penilaian menggunakan Supabase PostgreSQL untuk menyimpan:
- Progres pembelajaran user per materi
- Skor quiz dan hasil detail
- Skor game dan pencapaian
- Statistik overall user dan achievements

## Database Schema

### Tables

#### `user_learning_progress`
Menyimpan progres pembelajaran untuk setiap materi.

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- material_id (VARCHAR, identifier untuk materi)
- material_title (VARCHAR, nama materi)
- status (ENUM: not_started, in_progress, completed, locked)
- progress (INTEGER, 0-100)
- started_at (TIMESTAMP)
- completed_at (TIMESTAMP)
- last_accessed_at (TIMESTAMP)
```

#### `user_quiz_scores`
Menyimpan hasil kuis user.

```sql
- id (UUID, Primary Key)
- user_id (UUID)
- quiz_id (VARCHAR)
- quiz_title (VARCHAR)
- score (INTEGER, 0-100)
- correct_answers (INTEGER)
- total_questions (INTEGER)
- time_taken (INTEGER, dalam detik)
- grade (VARCHAR, A-F)
- details (JSONB, detail jawaban)
- completed_at (TIMESTAMP)
```

#### `user_game_scores`
Menyimpan hasil game user.

```sql
- id (UUID, Primary Key)
- user_id (UUID)
- game_id (VARCHAR)
- game_title (VARCHAR)
- game_type (ENUM: challenge, guess, simulator)
- score (INTEGER, 0-100)
- level_reached (INTEGER)
- lives_remaining (INTEGER)
- time_taken (INTEGER)
- details (JSONB, data spesifik game)
- completed_at (TIMESTAMP)
```

#### `user_statistics`
Menyimpan statistik aggregat user.

```sql
- id (UUID, Primary Key)
- user_id (UUID, Unique)
- total_score (INTEGER)
- total_quizzes_completed (INTEGER)
- total_games_completed (INTEGER)
- total_materials_completed (INTEGER)
- best_quiz_score (INTEGER)
- best_game_score (INTEGER)
- current_level (VARCHAR: Pemula, Dasar, Menengah, Ahli)
- total_study_time (INTEGER, dalam menit)
- streak_days (INTEGER)
- last_activity_date (DATE)
- achievements (JSONB, array achievements)
```

## Setup Instructions

### 1. Run Migration

Ada 2 cara untuk setup database:

#### Option A: Via File Migration (Recommended)
Jalankan file SQL migration yang sudah dibersihkan:

```bash
# Copy dan paste konten dari:
supabase/migrations/001_assessment_schema_clean.sql
```

#### Option B: Via Migration File Asli
```bash
# Copy dan paste konten dari:
supabase/migrations/001_assessment_schema.sql
```

**Penting**: File migration tidak include default data insert karena `auth.uid()` tidak tersedia di SQL editor. Default data akan di-initialize otomatis saat user pertama kali mengakses sistem assessment melalui aplikasi.

Di Supabase Dashboard:
1. Buka project Supabase
2. Pergi ke SQL Editor
3. Buat query baru
4. Paste konten migration file
5. Jalankan query

### 2. Enable Row Level Security (RLS)

Migration sudah include RLS policies yang memastikan:
- User hanya bisa akses data mereka sendiri
- Authentication menggunakan `auth.uid()`
- Policies untuk SELECT, INSERT, UPDATE sesuai kebutuhan

### 3. Test Database

Untuk test apakah database setup bekerja:

```sql
-- Test insert user progress
INSERT INTO user_learning_progress 
(user_id, material_id, material_title, status) 
VALUES 
(auth.uid(), 'test', 'Test Material', 'in_progress');

-- Test insert quiz score
INSERT INTO user_quiz_scores 
(user_id, quiz_id, quiz_title, score, correct_answers, total_questions) 
VALUES 
(auth.uid(), 'test-quiz', 'Test Quiz', 85, 17, 20);

-- Check user statistics (should auto-update via triggers)
SELECT * FROM user_statistics WHERE user_id = auth.uid();
```

## API Integration

### Frontend Integration

```typescript
// Save quiz score
import { saveQuizScore } from '@/lib/assessment-utils'

await saveQuizScore({
  userId: user.id,
  quizId: 'basic-gates',
  quizTitle: 'Kuis Gerbang Dasar',
  score: 85,
  correctAnswers: 17,
  totalQuestions: 20,
  timeTaken: 180
})

// Update learning progress
import { updateLearningProgress } from '@/lib/assessment-utils'

await updateLearningProgress({
  userId: user.id,
  materialId: 'pengenalan',
  materialTitle: 'Pengenalan Gerbang Logika',
  status: 'completed',
  progress: 100
})
```

### Data Loading

```typescript
// Hook usage
import { useAssessmentData } from '@/hooks/use-assessment-data'

const { 
  overviewData, 
  learningProgress, 
  scoreHistory, 
  loading 
} = useAssessmentData()
```

## Features

### Auto-initialization
- User progress otomatis diinisialisasi saat pertama login
- Default 8 learning materials dengan status appropriate
- User statistics dimulai dari nilai 0

### Automatic Statistics Update
- Database triggers otomatis update `user_statistics`
- Best scores dan totals ter-track otomatis
- Current level di-calculate berdasarkan materials completed

### Performance Optimization
- Indexes pada kolom yang sering di-query
- RLS policies untuk security
- JSONB untuk flexible data storage

## Monitoring

### Useful Queries

```sql
-- User activity overview
SELECT 
  COUNT(*) as total_users,
  AVG(total_score) as avg_score,
  AVG(total_materials_completed) as avg_materials
FROM user_statistics;

-- Top performers
SELECT 
  user_id,
  total_score,
  best_quiz_score,
  best_game_score,
  current_level
FROM user_statistics 
ORDER BY total_score DESC 
LIMIT 10;

-- Recent activity
SELECT 
  uqs.user_id,
  uqs.quiz_title,
  uqs.score,
  uqs.completed_at
FROM user_quiz_scores uqs
ORDER BY completed_at DESC 
LIMIT 20;
```

## Troubleshooting

### Common Issues

1. **"null value in column user_id" error**
   - Ini terjadi jika ada INSERT statement yang menggunakan `auth.uid()` di SQL editor
   - **Solusi**: Gunakan `001_assessment_schema_clean.sql` yang tidak include default data insert
   - Default data akan otomatis ter-create saat user login pertama kali

2. **RLS Policies**: Pastikan user sudah authenticated sebelum akses data
3. **Triggers**: Jika statistics tidak update, check trigger functions
4. **Initialization**: User baru harus di-initialize dengan `checkAndInitializeUser()`

### Debug Commands

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename LIKE 'user_%';

-- Check triggers
SELECT * FROM pg_trigger WHERE tgname LIKE '%update_stats%';

-- Check user authentication
SELECT auth.uid();
```
