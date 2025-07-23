'use client'

import { QuizQuestion } from '@/types/quiz'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'
import Image from 'next/image'

interface QuestionCardProps {
  question: QuizQuestion
  selectedAnswer?: string
  onAnswer?: (answer: string) => void
  showResult?: boolean
  disabled?: boolean
}

export const QuestionCard = ({
  question,
  selectedAnswer,
  onAnswer,
  showResult = false,
  disabled = false
}: QuestionCardProps) => {
  const isCorrect = showResult && selectedAnswer === question.correctAnswer

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
          {question.question}
        </h3>
        
        {/* Question Image */}
        {question.image && (
          <div className="flex justify-center">
            <div className="relative max-w-lg w-full">
              <Image
                src={question.image}
                alt="Gambar soal"
                width={500}
                height={300}
                className="rounded-lg border shadow-sm object-contain bg-white"
                priority={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {/* Options Image if exists */}
        {question.optionsImage && (
          <div className="flex justify-center mb-4">
            <div className="relative max-w-lg w-full">
              <Image
                src={question.optionsImage}
                alt="Pilihan jawaban"
                width={500}
                height={300}
                className="rounded-lg border shadow-sm object-contain bg-white"
                priority={false}
              />
            </div>
          </div>
        )}
        {showResult ? (
          // Show results with colors
          <div className="space-y-2">
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option.value
              const isCorrectOption = option.value === question.correctAnswer
              
              let cardClassName = "p-4 border rounded-lg transition-colors"
              let iconElement = null
              
              if (isCorrectOption) {
                cardClassName += " bg-green-50 border-green-200"
                iconElement = <Check className="h-5 w-5 text-green-600" />
              } else if (isSelected && !isCorrectOption) {
                cardClassName += " bg-red-50 border-red-200"
                iconElement = <X className="h-5 w-5 text-red-600" />
              } else {
                cardClassName += " bg-gray-50 border-gray-200"
              }

              return (
                <Card key={option.id} className={cardClassName}>
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {option.id.toUpperCase()}
                          </span>
                        </div>
                        <span className={cn(
                          "text-sm",
                          isCorrectOption ? "text-green-900 font-medium" : "text-gray-900"
                        )}>
                          {option.text}
                        </span>
                      </div>
                      {iconElement}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          // Interactive options
          <RadioGroup 
            value={selectedAnswer || ""} 
            onValueChange={onAnswer}
            disabled={disabled}
            className="space-y-2"
          >
            {question.options.map((option) => (
              <div key={option.id} className="relative">
                <Label
                  htmlFor={`option-${option.id}`}
                  className={cn(
                    "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50",
                    selectedAnswer === option.value 
                      ? "bg-blue-50 border-blue-200 ring-1 ring-blue-500" 
                      : "border-gray-200",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  <RadioGroupItem 
                    value={option.value} 
                    id={`option-${option.id}`}
                    className={cn(
                      selectedAnswer === option.value && "text-blue-600 border-blue-600"
                    )}
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                      selectedAnswer === option.value 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 text-gray-700"
                    )}>
                      <span className="text-sm font-medium">
                        {option.id.toUpperCase()}
                      </span>
                    </div>
                    <span className={cn(
                      "text-sm",
                      selectedAnswer === option.value 
                        ? "text-blue-900 font-medium" 
                        : "text-gray-900"
                    )}>
                      {option.text}
                    </span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      {/* Explanation (shown in result mode) */}
      {showResult && question.explanation && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Penjelasan:</h4>
          <p className="text-sm text-blue-800">{question.explanation}</p>
        </div>
      )}

      {/* Result Status */}
      {showResult && (
        <div className={cn(
          "flex items-center justify-center p-3 rounded-lg font-medium",
          isCorrect 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        )}>
          {isCorrect ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Jawaban Benar!
            </>
          ) : (
            <>
              <X className="h-5 w-5 mr-2" />
              {selectedAnswer ? 'Jawaban Salah' : 'Tidak Dijawab'}
            </>
          )}
        </div>
      )}
    </div>
  )
}
