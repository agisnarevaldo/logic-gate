'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useChallengeGame } from '@/hooks/use-challenge-game'
import { ChallengeCanvas } from '@/components/challenge/challenge-canvas'
import { GateSelector } from '@/components/challenge/gate-selector'
import { ChallengeResult } from '@/components/challenge/challenge-result'
import { Play, ArrowLeft, Trophy, Target } from 'lucide-react'

export const ChallengeGame: React.FC = () => {
  const {
    currentChallenge,
    challengeIndex,
    gameState,
    userAnswers,
    score,
    totalChallenges,
    isCorrect,
    setUserAnswer,
    checkAnswer,
    nextChallenge,
    restartGame,
    isLastChallenge
  } = useChallengeGame()

  const [selectedMissingId, setSelectedMissingId] = useState<string | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)

  // Reset selected missing component when challenge changes
  useEffect(() => {
    setSelectedMissingId(null)
  }, [challengeIndex])

  const handleGateSelect = (gateType: string) => {
    if (selectedMissingId) {
      setUserAnswer(selectedMissingId, gateType)
      setSelectedMissingId(null)
    }
  }

  const handleCheckAnswer = () => {
    checkAnswer()
  }

  const restartCurrentChallenge = () => {
    // Reset answers for current challenge
    setUserAnswer(currentChallenge?.missingComponentId || '', '')
    setSelectedMissingId(null)
  }

  const startGame = () => {
    setShowInstructions(false)
  }

  const backToInstructions = () => {
    setShowInstructions(true)
    restartGame()
  }

  // Show instructions screen
  if (showInstructions) {
    return (
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center px-4 py-6">
            <div className="flex justify-center mb-4">
              <Trophy className="h-12 w-12 md:h-16 md:w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold">Logic Challenge</CardTitle>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Uji kemampuanmu dalam menyelesaikan rangkaian gerbang logika!
            </p>
          </CardHeader>
          <CardContent className="space-y-4 px-4 pb-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-sm md:text-base">
                <Target className="h-4 w-4 md:h-5 md:w-5" />
                Cara Bermain:
              </h3>
              <ul className="space-y-2 text-xs md:text-sm text-gray-600 ml-4 md:ml-6">
                <li>• Kamu akan diberikan rangkaian logika yang tidak lengkap</li>
                <li>• Beberapa gerbang logika akan ditampilkan sebagai tanda tanya (?)</li>
                <li>• Pilih gerbang yang hilang dengan mengklik tanda tanya</li>
                <li>• Pilih jenis gerbang logika yang tepat dari pilihan yang tersedia</li>
                <li>• Pastikan output rangkaian sesuai dengan nilai yang diharapkan</li>
                <li>• Selesaikan semua tantangan untuk mendapatkan skor tertinggi!</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2 text-sm md:text-base">Tips:</h4>
              <ul className="text-xs md:text-sm text-blue-700 space-y-1">
                <li>• Perhatikan nilai input dan output yang diharapkan</li>
                <li>• Ingat karakteristik setiap gerbang logika (AND, OR, NOT, dll.)</li>
                <li>• Gunakan tabel kebenaran sebagai panduan</li>
              </ul>
            </div>

            <div className="flex justify-center pt-2">
              <Button onClick={startGame} size="lg" className="px-6 md:px-8 w-full md:w-auto">
                <Play className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                Mulai Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show result screen
  if (gameState === 'completed' || gameState === 'checking') {
    return (
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="mb-4">
          <Button 
            onClick={backToInstructions}
            variant="outline"
            size="sm"
            className="text-xs md:text-sm"
          >
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Kembali
          </Button>
        </div>

        <ChallengeResult
          isCorrect={isCorrect}
          score={score}
          totalChallenges={totalChallenges}
          currentChallenge={challengeIndex + 1}
          onNextChallenge={nextChallenge}
          onRestartChallenge={restartCurrentChallenge}
          onRestartGame={restartGame}
          isLastChallenge={isLastChallenge}
        />
      </div>
    )
  }

  if (!currentChallenge) return null

  // Count missing components that haven't been answered
  const missingComponents = currentChallenge.components.filter(
    comp => comp.type === 'MISSING' && !userAnswers[currentChallenge.id]
  )
  const canCheckAnswer = missingComponents.length === 0 && userAnswers[currentChallenge.id]

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <Button 
          onClick={backToInstructions}
          variant="outline"
          size="sm"
          className="text-xs md:text-sm"
        >
          <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          Kembali
        </Button>
        
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Tantangan {challengeIndex + 1}/{totalChallenges}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Skor: {score}/{totalChallenges}
          </Badge>
        </div>
      </div>

      {/* Main content - Mobile First Layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4">
        {/* Challenge Canvas - Full width on mobile */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card>
            <CardHeader className="px-3 py-4 md:px-6">
              <CardTitle className="text-base md:text-lg">{currentChallenge.title}</CardTitle>
              <p className="text-xs md:text-sm text-gray-600">{currentChallenge.description}</p>
            </CardHeader>
            <CardContent className="px-3 md:px-6">
              <ChallengeCanvas
                challenge={currentChallenge}
                userAnswers={userAnswers}
                selectedMissingId={selectedMissingId}
                onMissingComponentClick={setSelectedMissingId}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Top on mobile */}
        <div className="space-y-4 order-2 lg:order-2">
          {/* Gate Selector */}
          <GateSelector
            selectedMissingId={selectedMissingId}
            onGateSelect={handleGateSelect}
            disabled={false}
          />

          {/* Progress and Actions */}
          <Card>
            <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Gerbang tersisa:</span>
                  <span className="font-medium">{missingComponents.length}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Tingkat kesulitan:</span>
                  <Badge 
                    variant={
                      currentChallenge.difficulty === 'easy' ? 'default' :
                      currentChallenge.difficulty === 'medium' ? 'secondary' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {currentChallenge.difficulty === 'easy' ? 'Mudah' :
                     currentChallenge.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
                  </Badge>
                </div>
              </div>

              <Button 
                onClick={handleCheckAnswer}
                disabled={!canCheckAnswer}
                className="w-full text-sm"
                size="default"
              >
                Periksa Jawaban
              </Button>

              {!canCheckAnswer && (
                <p className="text-xs text-orange-600 text-center">
                  Lengkapi semua gerbang yang hilang terlebih dahulu
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
