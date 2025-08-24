'use client'

import { useState } from 'react'
import { useQuiz } from '@/hooks/use-quiz'
import { QuizContainer } from '@/components/quiz/quiz-container'
import { QuizResult } from '@/components/quiz/quiz-result'
import { PageLoadingScreen } from '@/components/page-loading-screen'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, BookOpen } from 'lucide-react'

export const QuizMain = () => {
  const [hasStarted, setHasStarted] = useState(false)
  
  const quiz = useQuiz({
    questionCount: 25,
    settings: {
      randomizeQuestions: true,
      randomizeOptions: false,
      timeLimit: null,
      showCorrectAnswer: true,
      allowReview: true
    }
  })

  const handleStartQuiz = () => {
    quiz.startQuiz()
    setHasStarted(true)
  }

  const handleRestartQuiz = () => {
    quiz.resetQuiz()
    setHasStarted(false)
  }

  if (quiz.isLoading) {
    return (
      <PageLoadingScreen 
        bgColor="bg-blue-600"
        icon={<BookOpen size={60} />}
        text="Memuat Kuis"
        onComplete={() => {}}
      />
    )
  }

  // Show quiz result
  if (quiz.result) {
    return (
      <QuizResult 
        result={quiz.result}
        session={quiz.session!}
        onRestart={handleRestartQuiz}
        onReview={() => {
          // TODO: Implement review mode
          console.log('Review mode not implemented yet')
        }}
      />
    )
  }

  // Show quiz questions
  if (hasStarted && quiz.session && quiz.currentQuestion) {
    return (
      <QuizContainer 
        session={quiz.session}
        currentQuestion={quiz.currentQuestion}
        currentAnswer={quiz.currentAnswer}
        progress={quiz.progress}
        timeRemaining={quiz.timeRemaining}
        isFirstQuestion={quiz.isFirstQuestion}
        isLastQuestion={quiz.isLastQuestion}
        canFinish={quiz.canFinish}
        hasAnswered={quiz.hasAnswered}
        onAnswer={quiz.answerQuestion}
        onNext={quiz.nextQuestion}
        onPrevious={quiz.previousQuestion}
        onGoToQuestion={quiz.goToQuestion}
        onFinish={quiz.finishQuiz}
        onExit={handleRestartQuiz}
      />
    )
  }

  // Show start screen
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Kuis Gerbang Logika</h1>
        </div>
        <p className="text-gray-600">
          Uji pemahaman Anda tentang gerbang logika dengan 25 soal pilihan ganda
        </p>
      </div>

      {/* Start Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Siap untuk memulai?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">25 Soal</div>
              <p className="text-gray-600">Berbagai kategori gerbang logika</p>
            </div>
            
            <Button 
              onClick={handleStartQuiz}
              className="w-full"
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Mulai Kuis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">📊 Detail Kuis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Soal:</span>
              <span className="font-medium">25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Kategori:</span>
              <span className="font-medium">Semua</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Waktu:</span>
              <span className="font-medium">Tidak terbatas</span>
            </div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">🎯 Tips Mengerjakan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>• Bacalah soal dengan teliti</p>
            <p>• Perhatikan gambar gerbang logika</p>
            <p>• Gunakan tabel kebenaran jika perlu</p>
            <p>• Periksa jawaban sebelum lanjut</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
