'use client'

import { QuizQuestion, QuizSession } from '@/types/quiz'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { QuestionCard } from '@/components/quiz/question-card'
import { QuizNavigation } from '@/components/quiz/quiz-navigation'
import { Timer } from '@/components/quiz/timer'
import { 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  X,
  BookOpen,
  CheckCircle
} from 'lucide-react'
import { getCategoryName, getDifficultyColor, getDifficultyName } from '@/lib/quiz-utils'

interface QuizContainerProps {
  session: QuizSession
  currentQuestion: QuizQuestion
  currentAnswer?: string
  progress: number
  timeRemaining: number | null
  isFirstQuestion: boolean
  isLastQuestion: boolean
  canFinish: boolean
  hasAnswered: boolean
  onAnswer: (questionId: number, answer: string) => void
  onNext: () => void
  onPrevious: () => void
  onGoToQuestion: (index: number) => void
  onFinish: () => void
  onExit: () => void
}

export const QuizContainer = ({
  session,
  currentQuestion,
  currentAnswer,
  progress,
  timeRemaining,
  isFirstQuestion,
  isLastQuestion,
  canFinish,
  hasAnswered,
  onAnswer,
  onNext,
  onPrevious,
  onGoToQuestion,
  onFinish,
  onExit
}: QuizContainerProps) => {
  const currentIndex = session.currentQuestionIndex
  const totalQuestions = session.questions.length
  const answeredCount = Object.keys(session.answers).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">
                  Kuis Gerbang Logika
                </h1>
              </div>
              {timeRemaining && (
                <Timer 
                  timeRemaining={timeRemaining}
                  isWarning={timeRemaining <= 300} // 5 minutes warning
                />
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onExit}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Keluar
            </Button>
          </div>
          
          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Soal {currentIndex + 1} dari {totalQuestions}
              </span>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  <CheckCircle className="h-4 w-4 inline mr-1" />
                  {answeredCount}/{totalQuestions} dijawab
                </span>
                <span className="font-medium text-blue-600">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Question Content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Question */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    Soal {currentQuestion.id}
                  </Badge>
                  <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                    {getDifficultyName(currentQuestion.difficulty)}
                  </Badge>
                  <Badge variant="secondary">
                    {getCategoryName(currentQuestion.category)}
                  </Badge>
                </div>
                {hasAnswered && (
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Terjawab
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <QuestionCard 
                question={currentQuestion}
                selectedAnswer={currentAnswer}
                onAnswer={(answer) => onAnswer(currentQuestion.id, answer)}
                showResult={false}
              />
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline"
                  onClick={onPrevious}
                  disabled={isFirstQuestion}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Sebelumnya
                </Button>

                <div className="flex items-center space-x-2">
                  {!isLastQuestion ? (
                    <Button 
                      onClick={onNext}
                      disabled={!hasAnswered}
                    >
                      Selanjutnya
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={onFinish}
                      disabled={!canFinish}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Selesai
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Question Navigation */}
        <div className="lg:col-span-1">
          <QuizNavigation 
            session={session}
            currentIndex={currentIndex}
            onGoToQuestion={onGoToQuestion}
          />
        </div>
      </div>
    </div>
  )
}
