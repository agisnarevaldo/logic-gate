'use client'

import { QuizResult as QuizResultType, QuizSession } from '@/types/quiz'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  RotateCcw, 
  Eye, 
  Clock, 
  Target,
  TrendingUp,
  BookOpen,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { getCategoryName } from '@/lib/quiz-utils'
import { saveQuizScore } from '@/lib/assessment-utils'
import { useAuth } from '@/providers/auth-provider'
import { useEffect } from 'react'

interface QuizResultProps {
  result: QuizResultType
  session: QuizSession
  onRestart: () => void
  onReview: () => void
}

export const QuizResult = ({
  result,
  session,
  onRestart,
  onReview
}: QuizResultProps) => {
  const { user } = useAuth()
  
  const { 
    totalQuestions, 
    correctAnswers, 
    incorrectAnswers,
    scorePercentage, 
    grade,
    timeTaken,
    categoryBreakdown 
  } = result

  // Save quiz score to database when component mounts
  useEffect(() => {
    if (user?.id) {
      // Determine category from questions in session
      const categories = session.questions.map(q => q.category)
      const mostCommonCategory = categories.length > 0 ? categories[0] : 'basic-gates'
      
      saveQuizScore({
        userId: user.id,
        quizId: mostCommonCategory,
        quizTitle: `Quiz ${getCategoryName(mostCommonCategory)}`,
        score: scorePercentage,
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
        timeTaken: timeTaken,
        details: {
          grade,
          categoryBreakdown,
          categories: categories,
          completedAt: new Date().toISOString()
        }
      }).catch(error => {
        console.error('Failed to save quiz score:', error)
      })
    }
  }, [user?.id, session.questions, scorePercentage, totalQuestions, correctAnswers, timeTaken, grade, categoryBreakdown])

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100'
      case 'B': return 'text-blue-600 bg-blue-100'
      case 'C': return 'text-yellow-600 bg-yellow-100'
      case 'D': return 'text-orange-600 bg-orange-100'
      case 'F': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return { text: "Luar biasa! 🎉", color: "text-green-600" }
    if (score >= 80) return { text: "Bagus sekali! 👏", color: "text-blue-600" }
    if (score >= 70) return { text: "Cukup baik! 👍", color: "text-yellow-600" }
    if (score >= 60) return { text: "Perlu latihan lagi 📚", color: "text-orange-600" }
    return { text: "Semangat belajar! 💪", color: "text-red-600" }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const performance = getPerformanceMessage(scorePercentage)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Hasil Kuis</h1>
        </div>
        <p className={`text-xl font-medium ${performance.color}`}>
          {performance.text}
        </p>
      </div>

      {/* Main Results */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Score Card */}
        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Skor Akhir</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-6xl font-bold text-blue-600">
                {scorePercentage}%
              </div>
              <Badge className={`text-2xl px-4 py-2 ${getGradeColor(grade)}`}>
                Grade {grade}
              </Badge>
            </div>
            <Progress value={scorePercentage} className="h-3" />
            <p className="text-gray-600">
              {correctAnswers} dari {totalQuestions} soal benar
            </p>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Statistik Detail</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Benar</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
                <div className="text-sm text-gray-600">Salah</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Waktu</span>
              </div>
              <span className="font-medium">{formatTime(timeTaken)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Performa per Kategori</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryBreakdown).map(([category, stats]) => {
              const percentage = Math.round((stats.correct / stats.total) * 100)
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{getCategoryName(category)}</span>
                    <span className="text-sm text-gray-600">
                      {stats.correct}/{stats.total} ({percentage}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={onReview}
          variant="outline" 
          size="lg"
          disabled={!session.settings.allowReview}
        >
          <Eye className="h-5 w-5 mr-2" />
          Review Jawaban
        </Button>
        <Button 
          onClick={onRestart}
          size="lg"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Kuis Baru
        </Button>
      </div>

      {/* Recommendation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <BookOpen className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Rekomendasi Belajar</h3>
              <div className="text-sm text-blue-800 space-y-1">
                {scorePercentage < 70 && (
                  <p>• Pelajari kembali materi gerbang logika dasar</p>
                )}
                {Object.entries(categoryBreakdown).some(([, stats]) => (stats.correct / stats.total) < 0.7) && (
                  <p>• Fokus pada kategori dengan skor rendah</p>
                )}
                <p>• Kerjakan latihan soal lebih banyak</p>
                <p>• Gunakan simulator untuk memahami cara kerja gerbang</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
