'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react'

interface ChallengeResultProps {
  isCorrect: boolean
  score: number
  totalChallenges: number
  currentChallenge: number
  onNextChallenge: () => void
  onRestartChallenge: () => void
  onRestartGame: () => void
  isLastChallenge: boolean
}

export const ChallengeResult: React.FC<ChallengeResultProps> = ({
  isCorrect,
  score,
  totalChallenges,
  currentChallenge,
  onNextChallenge,
  onRestartChallenge,
  onRestartGame,
  isLastChallenge
}) => {
  const percentage = Math.round((score / totalChallenges) * 100)

  if (isLastChallenge && isCorrect) {
    // Final result card
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center p-4 sm:p-6">
          <div className="flex justify-center mb-2">
            <Trophy className="h-10 sm:h-12 w-10 sm:w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-lg sm:text-xl">Selamat! Game Selesai!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {score}/{totalChallenges}
            </div>
            <div className="text-base sm:text-lg text-gray-600">
              Skor Akhir: {percentage}%
            </div>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-gray-600">
            {percentage === 100 && (
              <p className="text-green-600 font-medium">Perfect! Kamu menguasai semua tantangan!</p>
            )}
            {percentage >= 80 && percentage < 100 && (
              <p className="text-blue-600 font-medium">Excellent! Pemahaman yang sangat baik!</p>
            )}
            {percentage >= 60 && percentage < 80 && (
              <p className="text-yellow-600 font-medium">Good! Terus berlatih untuk hasil yang lebih baik!</p>
            )}
            {percentage < 60 && (
              <p className="text-red-600 font-medium">Perlu lebih banyak latihan. Jangan menyerah!</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              onClick={onRestartGame}
              className="w-full text-sm sm:text-base"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Main Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center p-4 sm:p-6">
        <div className="flex justify-center mb-2">
          {isCorrect ? (
            <CheckCircle className="h-10 sm:h-12 w-10 sm:w-12 text-green-500" />
          ) : (
            <XCircle className="h-10 sm:h-12 w-10 sm:w-12 text-red-500" />
          )}
        </div>
        <CardTitle className={`text-lg sm:text-xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? 'Benar!' : 'Salah!'}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6">
        <div className="space-y-2">
          <div className="text-xs sm:text-sm text-gray-600">
            Tantangan {currentChallenge} dari {totalChallenges}
          </div>
          <div className="text-base sm:text-lg font-semibold">
            Skor: {score}/{totalChallenges}
          </div>
        </div>

        <div className="text-xs sm:text-sm text-gray-600">
          {isCorrect 
            ? 'Rangkaian logika yang kamu pilih sudah benar!' 
            : 'Coba periksa kembali gerbang logika yang kamu pilih.'
          }
        </div>

        <div className="flex flex-col gap-2">
          {isCorrect ? (
            <Button 
              onClick={onNextChallenge}
              className="w-full text-sm sm:text-base"
            >
              {isLastChallenge ? 'Lihat Hasil Akhir' : 'Tantangan Berikutnya'}
            </Button>
          ) : (
            <Button 
              onClick={onRestartChallenge}
              variant="outline"
              className="w-full text-sm sm:text-base"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
