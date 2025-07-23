'use client'

import { QuizSession } from '@/types/quiz'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckCircle, Circle, Navigation } from 'lucide-react'

interface QuizNavigationProps {
  session: QuizSession
  currentIndex: number
  onGoToQuestion: (index: number) => void
}

export const QuizNavigation = ({
  session,
  currentIndex,
  onGoToQuestion
}: QuizNavigationProps) => {
  const { questions, answers } = session
  const answeredCount = Object.keys(answers).length
  const unansweredCount = questions.length - answeredCount

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Navigation className="h-5 w-5" />
          <span>Navigasi Soal</span>
        </CardTitle>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>{answeredCount} terjawab</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Circle className="h-4 w-4" />
            <span>{unansweredCount} tersisa</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => {
            const isAnswered = question.id in answers
            const isCurrent = index === currentIndex
            
            return (
              <Button
                key={question.id}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                onClick={() => onGoToQuestion(index)}
                className={cn(
                  "h-10 w-10 p-0 relative",
                  isAnswered && !isCurrent && "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
                  isCurrent && "ring-2 ring-blue-500 ring-offset-2"
                )}
              >
                <span className="text-xs font-medium">{index + 1}</span>
                {isAnswered && !isCurrent && (
                  <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600 bg-white rounded-full" />
                )}
              </Button>
            )
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded border"></div>
            <span className="text-gray-600">Soal saat ini</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded flex items-center justify-center">
              <CheckCircle className="h-2.5 w-2.5 text-green-600" />
            </div>
            <span className="text-gray-600">Sudah dijawab</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border border-gray-200 rounded bg-white"></div>
            <span className="text-gray-600">Belum dijawab</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
