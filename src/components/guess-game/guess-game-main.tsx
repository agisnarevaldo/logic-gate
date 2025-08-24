'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useGuessGame } from '@/hooks/use-guess-game'
import { GuessGameInstructions } from '@/components/guess-game/guess-game-instructions'
import { GuessGameGrid } from '@/components/guess-game/guess-game-grid'
import { 
  Clock, 
  Heart, 
  Target, 
  CheckCircle, 
  XCircle, 
  Trophy,
  RotateCcw,
  ArrowRight,
  Home
} from 'lucide-react'

export function GuessGameMain() {
  const {
    session,
    currentChallenge,
    gameState,
    canSubmit,
    isGameOver,
    progress,
    startGame,
    toggleImageSelection,
    checkAnswer,
    nextChallenge,
    restartChallenge,
    restartGame
  } = useGuessGame()

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Instructions screen
  if (gameState === 'instructions') {
    return <GuessGameInstructions onStartGame={startGame} />
  }

  // Game over screen
  if (isGameOver) {
    return (
      <div className="container mx-auto">
        <Card className="w-full max-w-max mx-auto">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl text-red-600">Game Over</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-3xl font-bold">{session.score}</div>
              <div className="text-gray-600">Skor Akhir</div>
            </div>
            <div className="text-sm text-gray-600">
              Nyawa habis! Jangan menyerah, coba lagi untuk hasil yang lebih baik.
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={restartGame} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Main Lagi
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/game'} className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Kembali ke Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Game completed screen
  if (gameState === 'completed') {
    const percentage = Math.round((session.score / (session.challenges.length * 100)) * 100)
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-xl">Selamat!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">{session.score}</div>
              <div className="text-gray-600">Skor Total</div>
              <div className="text-lg font-semibold">{percentage}%</div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              {percentage >= 90 && (
                <p className="text-green-600 font-medium">Luar biasa! Kamu sangat memahami aplikasi gerbang logika!</p>
              )}
              {percentage >= 70 && percentage < 90 && (
                <p className="text-blue-600 font-medium">Bagus! Pemahaman yang baik tentang gerbang logika!</p>
              )}
              {percentage >= 50 && percentage < 70 && (
                <p className="text-yellow-600 font-medium">Tidak buruk! Terus belajar untuk hasil yang lebih baik!</p>
              )}
              {percentage < 50 && (
                <p className="text-red-600 font-medium">Perlu lebih banyak latihan. Jangan menyerah!</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="font-semibold text-blue-800">Level Selesai</div>
                <div className="text-blue-600">{session.challenges.length}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-semibold text-green-800">Skor Rata-rata</div>
                <div className="text-green-600">{Math.round(session.score / session.challenges.length)}</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={restartGame} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Main Lagi
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/game'} className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Kembali ke Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Result screen
  if (gameState === 'result') {
    const correctCount = session.correctSelections.length
    const incorrectCount = session.incorrectSelections.length
    const isSuccess = correctCount >= Math.ceil(currentChallenge.correctCount * 0.7)
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center">
            {isSuccess ? (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            )}
            <CardTitle className={`text-xl ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {isSuccess ? 'Bagus!' : 'Belum Tepat'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score breakdown */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-green-800 font-semibold">Benar</div>
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-red-800 font-semibold">Salah</div>
                <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-800 font-semibold">Skor</div>
                <div className="text-2xl font-bold text-blue-600">+{session.score - (session.score - 100 || 0)}</div>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Penjelasan:</h4>
              <p className="text-sm text-gray-700">{currentChallenge.explanation}</p>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{session.challengeIndex + 1}/{session.challenges.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {isSuccess ? (
                <Button onClick={nextChallenge} className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {session.challengeIndex < session.challenges.length - 1 ? 'Level Berikutnya' : 'Lihat Hasil'}
                </Button>
              ) : (
                <Button onClick={restartChallenge} variant="outline" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Coba Lagi
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main game screen
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Game header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">{currentChallenge.title}</h1>
            <p className="text-gray-600 text-sm">{currentChallenge.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              Level {session.challengeIndex + 1}/{session.challenges.length}
            </Badge>
            <Badge 
              variant={
                currentChallenge.difficulty === 'easy' ? 'default' :
                currentChallenge.difficulty === 'medium' ? 'secondary' : 'destructive'
              }
            >
              {currentChallenge.difficulty === 'easy' ? 'Mudah' :
               currentChallenge.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
            </Badge>
          </div>
        </div>

        {/* Game stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <Clock className="h-5 w-5 mx-auto mb-1 text-blue-600" />
            <div className="text-sm text-blue-800 font-semibold">
              {formatTime(session.timeRemaining)}
            </div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <Heart className="h-5 w-5 mx-auto mb-1 text-red-600" />
            <div className="text-sm text-red-800 font-semibold">
              {session.lives}/{session.maxLives}
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <Target className="h-5 w-5 mx-auto mb-1 text-green-600" />
            <div className="text-sm text-green-800 font-semibold">
              {currentChallenge.correctCount} jawaban
            </div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <Trophy className="h-5 w-5 mx-auto mb-1 text-purple-600" />
            <div className="text-sm text-purple-800 font-semibold">
              {session.score} poin
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress Game</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Game grid */}
      <div className="mb-6">
        <GuessGameGrid
          images={session.currentImages}
          selectedImages={session.selectedImages}
          onImageSelect={toggleImageSelection}
          maxSelections={currentChallenge.correctCount}
          disabled={gameState === 'checking'}
        />
      </div>

      {/* Submit button */}
      <div className="text-center">
        <Button 
          onClick={checkAnswer}
          disabled={!canSubmit || gameState === 'checking'}
          size="lg"
          className="px-8"
        >
          {gameState === 'checking' ? 'Memeriksa...' : 'Periksa Jawaban'}
        </Button>
        
        {!canSubmit && (
          <p className="text-sm text-orange-600 mt-2">
            Pilih minimal 1 gambar untuk melanjutkan
          </p>
        )}
      </div>
    </div>
  )
}
