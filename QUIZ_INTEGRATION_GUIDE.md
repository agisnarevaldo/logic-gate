# Panduan Integrasi Academic Scoring untuk Quiz Lainnya

## Status Quiz Components

### ✅ Sudah Terintegrasi
- **MatchingQuiz** (`matching-quiz.tsx`) - LENGKAP ✅
- **BasicGatesQuiz** (`basic-gates-quiz.tsx`) - LENGKAP ✅

### 🔄 Perlu Diupdate
- **AdvancedGatesQuiz** (`advanced-gates-quiz.tsx`) - PERLU UPDATE
- **TruthTableQuiz** (`truth-table-quiz.tsx`) - PERLU UPDATE

## Template untuk Update Quiz Components

Untuk mengintegrasikan quiz components lainnya dengan academic scoring system, ikuti template berikut:

### 1. Import yang Diperlukan
```tsx
import { useState, useEffect } from "react"
import { useAcademicScoring } from "@/hooks/useAcademicScoring"
import { QuizDetailedResults, QuestionResult } from "@/types/academic-scoring"
import { formatTime } from "@/utils/academic-scoring"
```

### 2. State Management
```tsx
// Tambahkan state berikut ke component
const [startTime, setStartTime] = useState<Date | null>(null)
const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null)
const [quizResults, setQuizResults] = useState<{
  score: number
  percentage: number
  grade: string
  timeSpent: number
  feedback: {
    message: string
    suggestions: string[]
    achievements: string[]
  } | null
} | null>(null)

const { 
  startQuizAttempt, 
  completeQuizAttempt, 
  calculateGrade
} = useAcademicScoring()
```

### 3. Initialization
```tsx
// Initialize the quiz with academic scoring
useEffect(() => {
  const initializeQuiz = async () => {
    setStartTime(new Date())
    
    // Start new attempt in database
    try {
      const attemptId = await startQuizAttempt('QUIZ_TYPE_CODE', questions.length)
      setCurrentAttemptId(attemptId)
    } catch (error) {
      console.error('Failed to start quiz attempt:', error)
    }
  }
  
  initializeQuiz()
}, [startQuizAttempt])
```

### 4. Quiz Completion Logic
```tsx
const handleNextQuestion = async () => {
  if (currentQuestion < questions.length - 1) {
    // Go to next question
    setCurrentQuestion(currentQuestion + 1)
    setSelectedAnswer(null)
    setShowExplanation(false)
  } else {
    // Quiz completed - save to database
    if (currentAttemptId && startTime) {
      const timeSpentSeconds = Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      
      // Prepare detailed results
      const questionResults: QuestionResult[] = questions.map((q, index) => ({
        question_id: `quiz_type_${q.id}`,
        question_text: q.question,
        user_answer: userAnswers[index].toString(),
        correct_answer: q.correctAnswer.toString(),
        is_correct: userAnswers[index] === q.correctAnswer,
        time_taken_seconds: Math.floor(timeSpentSeconds / questions.length),
        difficulty: 'medium' as const, // adjust based on quiz
        topic: 'quiz_topic'
      }))

      const detailedResults: QuizDetailedResults = {
        questions: questionResults,
        summary: {
          total_questions: questions.length,
          correct_answers: score,
          incorrect_answers: questions.length - score,
          time_taken_seconds: timeSpentSeconds
        }
      }

      try {
        // Complete the attempt in database
        const completedAttempt = await completeQuizAttempt(
          currentAttemptId,
          score,
          questions.length,
          timeSpentSeconds,
          detailedResults
        )

        if (completedAttempt) {
          const grade = calculateGrade(completedAttempt.percentage || 0)
          
          setQuizResults({
            score: score,
            percentage: completedAttempt.percentage || 0,
            grade: grade.grade,
            timeSpent: timeSpentSeconds,
            feedback: null
          })
        }
      } catch (error) {
        console.error('Failed to complete quiz:', error)
        // Fallback to local scoring
        const localPercentage = Math.round((score / questions.length) * 100)
        const localGrade = calculateGrade(localPercentage)
        
        setQuizResults({
          score: score,
          percentage: localPercentage,
          grade: localGrade.grade,
          timeSpent: timeSpentSeconds,
          feedback: null
        })
      }
    }
    
    setQuizCompleted(true)
  }
}
```

### 5. Restart Logic
```tsx
const handleRestartQuiz = async () => {
  // Reset all state
  setCurrentQuestion(0)
  setSelectedAnswer(null)
  setShowExplanation(false)
  setScore(0)
  setAnsweredQuestions(new Array(questions.length).fill(false))
  setUserAnswers(new Array(questions.length).fill(-1))
  setQuizCompleted(false)
  setQuizResults(null)
  setStartTime(new Date())
  
  // Start new attempt in database
  try {
    const attemptId = await startQuizAttempt('QUIZ_TYPE_CODE', questions.length)
    setCurrentAttemptId(attemptId)
  } catch (error) {
    console.error('Failed to start quiz attempt:', error)
  }
}
```

### 6. UI Updates untuk Results
```tsx
// Update bagian hasil quiz untuk menampilkan academic scoring
{quizResults && (
  <>
    <div className="text-lg font-semibold mb-2">
      Grade: <span className={`px-2 py-1 rounded ${
        quizResults.grade === 'A+' || quizResults.grade === 'A' ? 'bg-green-100 text-green-800' :
        quizResults.grade === 'A-' || quizResults.grade === 'B+' ? 'bg-blue-100 text-blue-800' :
        quizResults.grade === 'B' || quizResults.grade === 'B-' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {quizResults.grade}
      </span>
    </div>
    <div className="text-sm text-gray-600 mb-4">
      Waktu: {formatTime(quizResults.timeSpent)}
    </div>
  </>
)}
```

## Quiz Type Codes

Sesuaikan dengan database schema:
- **BASIC_GATES** - untuk basic-gates-quiz
- **ADVANCED_GATES** - untuk advanced-gates-quiz  
- **TRUTH_TABLE** - untuk truth-table-quiz
- **GATE_SYMBOLS** - untuk matching-quiz (sudah selesai)

## Testing

Setelah update setiap komponen:
1. Test quiz berjalan normal
2. Check console untuk error
3. Check database apakah data tersimpan
4. Test restart quiz
5. Check halaman penilaian untuk statistik terupdate

## Next Steps

1. Update `advanced-gates-quiz.tsx` dengan template di atas
2. Update `truth-table-quiz.tsx` dengan template di atas
3. Test semua quiz types
4. Verify data tersimpan di database
5. Check statistik di halaman penilaian
