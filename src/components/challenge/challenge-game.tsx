'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useChallengeGame } from '@/hooks/use-challenge-game'
import { ChallengeCanvas } from '@/components/challenge/challenge-canvas'
import { GateSelector } from '@/components/challenge/gate-selector'
import { ChallengeResult } from '@/components/challenge/challenge-result'
import { Play, ArrowLeft, Trophy, Target, Repeat } from 'lucide-react'

export const  ChallengeGame: React.FC = () => {
  const {
    currentChallenge,
    challengeIndex,
    userAnswers,
    score,
    totalChallenges,
    isCorrect,
    setUserAnswer,
    checkAnswer,
    nextChallenge,
    restartGame,
    restartCurrentChallenge
    } = useChallengeGame()

  const [selectedMissingId, setSelectedMissingId] = useState<string | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const [showResult, setShowResult] = useState(false)

  // Reset selected missing component when challenge changes
  useEffect(() => {
    setSelectedMissingId(null)
    setShowResult(false)
  }, [challengeIndex])

  const handleGateSelect = (gateType: string) => {
    setUserAnswer(currentChallenge.id.toString(), gateType)
    setSelectedMissingId(null)
  }

  const handleCheckAnswer = () => {
    setIsChecking(true)
    checkAnswer()
    
    setTimeout(() => {
      setIsChecking(false)
      setShowResult(true)
    }, 1000)
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Logic Challenge</CardTitle>
            <p className="text-gray-600 mt-2">
              Uji kemampuanmu dalam menyelesaikan rangkaian gerbang logika!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="h-5 w-5" />
                Cara Bermain:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 ml-6">
                <li>• Kamu akan diberikan rangkaian logika yang tidak lengkap</li>
                <li>• Beberapa gerbang logika akan ditampilkan sebagai tanda tanya (?)</li>
                <li>• Pilih gerbang yang hilang dengan mengklik tanda tanya</li>
                <li>• Pilih jenis gerbang logika yang tepat dari pilihan yang tersedia</li>
                <li>• Pastikan output rangkaian sesuai dengan nilai yang diharapkan</li>
                <li>• Selesaikan semua tantangan untuk mendapatkan skor tertinggi!</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Tips:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Perhatikan nilai input dan output yang diharapkan</li>
                <li>• Ingat karakteristik setiap gerbang logika (AND, OR, NOT, dll.)</li>
                <li>• Gunakan tabel kebenaran sebagai panduan</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button onClick={startGame} size="lg" className="px-8">
                <Play className="h-5 w-5 mr-2" />
                Mulai Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show result screen
  if (showResult) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-4">
          <Button 
            onClick={backToInstructions}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>

        <ChallengeResult
          isCorrect={isCorrect}
          score={score}
          totalChallenges={totalChallenges}
          currentChallenge={challengeIndex + 1}
          onNextChallenge={() => {
            nextChallenge()
            setShowResult(false)
          }}
          onRestartChallenge={() => {
            restartCurrentChallenge()
            setShowResult(false)
          }}
          onRestartGame={restartGame}
          isLastChallenge={challengeIndex === totalChallenges - 1}
        />
      </div>
    )
  }

  if (!currentChallenge) return null

  // Count missing components that haven't been answered
  const hasAnswer = userAnswers[currentChallenge.id]
  const canCheckAnswer = !!hasAnswer

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={backToInstructions}
          variant="outline"
          size="sm"
        >
          <Repeat className="h-4 w-4 mr-1" />
          Ulangi
        </Button>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            Tantangan {challengeIndex + 1}/{totalChallenges}
          </Badge>
          <Badge variant="default">
            Skor: {score}/{totalChallenges}
          </Badge>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Challenge Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentChallenge.title}</CardTitle>
              <p className="text-sm text-gray-600">{currentChallenge.description}</p>
            </CardHeader>
            <CardContent>
              <ChallengeCanvas
                challenge={currentChallenge}
                userAnswers={userAnswers}
                selectedMissingId={selectedMissingId}
                onMissingComponentClick={setSelectedMissingId}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Gate Selector */}
          <GateSelector
            selectedMissingId={selectedMissingId}
            onGateSelect={handleGateSelect}
            disabled={isChecking}
          />

          {/* Progress and Actions */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <span className="font-medium">
                    {hasAnswer ? 'Sudah dijawab' : 'Belum dijawab'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
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
                disabled={!canCheckAnswer || isChecking}
                className="w-full"
              >
                {isChecking ? 'Memeriksa...' : 'Periksa Jawaban'}
              </Button>

              {!canCheckAnswer && (
                <p className="text-xs text-orange-600 text-center">
                  Pilih gerbang logika terlebih dahulu
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
