'use client'

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react'
import { saveGameScore } from '@/lib/assessment-utils'
import { useAuth } from '@/providers/auth-provider'

interface ChallengeResultProps {
  isCorrect: boolean
  score: number
  totalChallenges: number
  currentChallenge: number
  onRestartGame: () => void
  isLastChallenge: boolean
}

export const ChallengeResult: React.FC<ChallengeResultProps> = ({
  isCorrect,
  score,
  totalChallenges,
  currentChallenge,
  onRestartGame,
  isLastChallenge
}) => {
  const { user } = useAuth()
  const percentage = Math.round((score / totalChallenges) * 100)

  // Save game score when challenge game is completed
  useEffect(() => {
    if ((isLastChallenge || currentChallenge === totalChallenges) && user?.id) {
      saveGameScore({
        userId: user.id,
        gameId: 'challenge-game',
        gameTitle: 'Challenge Game - Logic Circuit',
        gameType: 'challenge',
        score: score,
        levelReached: currentChallenge,
        details: {
          totalChallenges,
          percentage,
          completedAt: new Date().toISOString()
        }
      }).catch(error => {
        console.error('Failed to save challenge game score:', error)
      })
    }
  }, [isLastChallenge, currentChallenge, totalChallenges, user?.id, score, percentage])

  // Show final results only when all challenges are completed
  if (isLastChallenge || currentChallenge === totalChallenges) {
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

  // Individual challenge result (auto-advances after showing)
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
            Skor: {percentage}%
          </div>
        </div>

        <div className="text-xs sm:text-sm text-gray-600">
          {isCorrect 
            ? 'Rangkaian logika yang kamu pilih sudah benar!' 
            : 'Jawaban yang benar akan ditampilkan sebentar lagi.'
          }
        </div>

        <div className="text-xs text-gray-500">
          {isLastChallenge 
            ? 'Menampilkan hasil akhir...' 
            : 'Melanjutkan ke tantangan berikutnya...'
          }
        </div>
      </CardContent>
    </Card>
  )
}
