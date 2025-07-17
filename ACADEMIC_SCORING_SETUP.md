# Sistem Penilaian Akademik - Setup dan Penggunaan

## Overview

Sistem penilaian akademik baru menggunakan pendekatan yang lebih komprehensif dengan integrasi Supabase untuk tracking progress dan analisis performa pembelajaran.

## Setup Database

### 1. Jalankan Schema SQL
```sql
-- Jalankan file: supabase-academic-scoring-schema.sql di Supabase SQL Editor
-- File ini berisi:
-- - Tabel quiz_types
-- - Tabel quiz_attempts  
-- - Tabel user_learning_stats
-- - Tabel topic_progress
-- - RLS policies
-- - Triggers untuk auto-update stats
```

### 2. Verifikasi Setup
Pastikan tabel-tabel berikut berhasil dibuat di database Supabase:
- `quiz_types` - Jenis-jenis quiz
- `quiz_attempts` - Record setiap attempt quiz
- `user_learning_stats` - Statistik pembelajaran per user
- `topic_progress` - Progress per topik pembelajaran

## Fitur Sistem Akademik

### 1. Grading System
- **A+**: 95-100% (Excellent)
- **A**: 90-94% (Very Good)  
- **A-**: 85-89% (Good)
- **B+**: 80-84% (Above Average)
- **B**: 75-79% (Average)
- **B-**: 70-74% (Below Average)
- **C+**: 65-69% (Satisfactory)
- **C**: 60-64% (Minimum Pass)
- **D**: 50-59% (Poor)
- **F**: 0-49% (Fail)

### 2. Mastery Levels
- **Beginner**: Baru memulai (skor rata-rata 0%+)
- **Intermediate**: Memahami konsep dasar (skor rata-rata 70%+, min 3 quiz)
- **Advanced**: Menguasai sebagian besar konsep (skor rata-rata 85%+, min 5 quiz)
- **Expert**: Menguasai semua konsep (skor rata-rata 95%+, min 7 quiz)

### 3. Analytics & Tracking
- Total quiz completed
- Average score & highest score
- Time spent learning
- Improvement rate
- Consistency score
- Performance per topic
- Learning curve analysis

## Implementasi di Komponen

### 1. Menggunakan Hook `useAcademicScoring`

```tsx
import { useAcademicScoring } from '@/hooks/useAcademicScoring'

function QuizComponent() {
  const {
    startQuizAttempt,
    completeQuizAttempt,
    userStats,
    getCurrentMasteryLevel,
    getPerformanceAnalytics
  } = useAcademicScoring()

  // Start quiz
  const handleStartQuiz = async () => {
    const attemptId = await startQuizAttempt('GATE_SYMBOLS', 7)
    // Store attemptId untuk digunakan saat selesai
  }

  // Complete quiz
  const handleCompleteQuiz = async () => {
    const result = await completeQuizAttempt(
      attemptId,
      correctAnswers,
      totalQuestions,
      timeSpentSeconds,
      detailedResults
    )
    // Quiz berhasil disimpan ke database
  }
}
```

### 2. Menampilkan Statistik

```tsx
import { AcademicStatsCard } from '@/components/academic/academic-stats-card'

function Dashboard() {
  return (
    <div>
      {/* Komponen otomatis load dan display stats */}
      <AcademicStatsCard />
    </div>
  )
}
```

## Struktur Data

### Quiz Attempt Flow
1. **Start**: `startQuizAttempt()` → creates record dengan score 0
2. **Progress**: User mengerjakan quiz
3. **Complete**: `completeQuizAttempt()` → update score, grade, time, results
4. **Auto-update**: Trigger otomatis update `user_learning_stats`

### Detailed Results Format
```typescript
{
  questions: [
    {
      question_id: "match_1",
      user_answer: "and_symbol",
      correct_answer: "and",
      is_correct: true,
      time_taken_seconds: 15,
      difficulty: "easy",
      topic: "logic_gate_symbols"
    }
  ],
  summary: {
    total_questions: 7,
    correct_answers: 6,
    incorrect_answers: 1,
    time_taken_seconds: 120
  }
}
```

## Quiz Types

### Current Quiz Types
1. **GATE_SYMBOLS** - Matching simbol gerbang logika
2. **BASIC_GATES** - Quiz gerbang dasar (AND, OR, NOT)
3. **ADVANCED_GATES** - Quiz gerbang turunan (NAND, NOR, XOR, XNOR)
4. **TRUTH_TABLE** - Quiz tabel kebenaran

### Menambah Quiz Type Baru
```sql
INSERT INTO quiz_types (name, code, description, max_score, passing_score, time_limit_minutes, difficulty_level) 
VALUES ('Quiz Baru', 'NEW_QUIZ', 'Deskripsi quiz', 100, 70, 10, 'intermediate');
```

## Performance Features

### 1. Feedback System
- Message berdasarkan grade
- Suggestions untuk improvement
- Achievements untuk motivasi

### 2. Analytics
- Improvement rate tracking
- Consistency scoring
- Time efficiency analysis
- Learning curve visualization

### 3. Topic Progress
- Individual topic mastery tracking
- Best score per topic
- Attempt count per topic

## Testing

### 1. Test Basic Flow
```typescript
// Test quiz completion flow
const attemptId = await startQuizAttempt('GATE_SYMBOLS', 7)
const result = await completeQuizAttempt(attemptId, 6, 7, 120, detailedResults)
console.log(result) // Should show completed attempt with grade
```

### 2. Reset Progress (Development)
```typescript
// Reset semua progress user untuk testing
await academicScoringService.resetUserProgress()
```

### 3. Check Statistics
```typescript
const stats = await academicScoringService.getUserLearningStats()
const attempts = await academicScoringService.getUserQuizAttempts()
console.log({ stats, attempts })
```

## Migration dari Sistem Lama

### Perubahan Utama
1. **Skor**: Dari simple count → Academic percentage & grade
2. **Database**: Dari local state → Supabase persistent storage
3. **Analytics**: Dari basic → Comprehensive tracking
4. **Feedback**: Dari static → Dynamic based on performance

### Backward Compatibility
- Komponen lama masih bisa digunakan dengan fallback ke sistem lama
- Gradual migration ke sistem baru
- Data lama tidak hilang (stored terpisah)

## Troubleshooting

### Common Issues
1. **Database Connection**: Pastikan Supabase client configured correctly
2. **RLS Policies**: User harus authenticated untuk akses data
3. **Quiz Type Not Found**: Pastikan quiz_types sudah di-insert
4. **Triggers Not Working**: Check trigger function dan permissions

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('academic_debug', 'true')

// Check current user
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)

// Check quiz types
const quizTypes = await academicScoringService.getQuizTypes()
console.log('Available quiz types:', quizTypes)
```

## Roadmap

### Next Features
1. **Leaderboard** - Social comparison
2. **Badges System** - Achievement gamification  
3. **Study Recommendations** - AI-powered suggestions
4. **Progress Reports** - Detailed PDF reports
5. **Adaptive Difficulty** - Dynamic question difficulty
6. **Time-based Analytics** - Learning pattern analysis

### Performance Optimizations
1. **Caching** - Cache frequent queries
2. **Batch Updates** - Optimize database writes
3. **Background Sync** - Offline capability
4. **Real-time Updates** - Live statistics updates
