'use client'

import { useState, useCallback, useEffect } from 'react'
import { GuessGameSession, GuessGameState } from '@/types/guess-game'
import { guessGameChallenges, generateChallengeImages } from '@/data/guess-game-data'

export const useGuessGame = () => {
  const [session, setSession] = useState<GuessGameSession>({
    challengeIndex: 0,
    challenges: guessGameChallenges,
    selectedImages: [],
    correctSelections: [],
    incorrectSelections: [],
    score: 0,
    lives: 3,
    maxLives: 3,
    isCompleted: false,
    timeStarted: Date.now(),
    timeRemaining: guessGameChallenges[0].timeLimit,
    currentImages: []
  })

  const [gameState, setGameState] = useState<GuessGameState>('instructions')

  const currentChallenge = session.challenges[session.challengeIndex]

  // Internal function for auto-advancing
  const nextChallengeInternal = useCallback(() => {
    const nextIndex = session.challengeIndex + 1
    
    if (nextIndex >= session.challenges.length) {
      // Game completed
      setSession(prev => ({ ...prev, isCompleted: true }))
      setGameState('completed')
    } else {
      // Next challenge
      const nextChallengeData = session.challenges[nextIndex]
      const newImages = generateChallengeImages(nextChallengeData)
      
      setSession(prev => ({
        ...prev,
        challengeIndex: nextIndex,
        currentImages: newImages,
        selectedImages: [],
        correctSelections: [],
        incorrectSelections: [],
        timeRemaining: nextChallengeData.timeLimit
      }))
      setGameState('playing')
    }
  }, [session])

  // Check answer function
  const checkAnswer = useCallback(() => {
    setSession(prev => {
      if (prev.timeRemaining === 0 || gameState !== 'playing') return prev

      setGameState('checking')

      const correctImages = prev.currentImages
        .filter(img => img.isCorrect)
        .map(img => img.id)

      const correctSelections = prev.selectedImages.filter(id => 
        correctImages.includes(id)
      )
      const incorrectSelections = prev.selectedImages.filter(id => 
        !correctImages.includes(id)
      )

      // Hitung skor
      const correctCount = correctSelections.length
      const incorrectCount = incorrectSelections.length
      const missedCount = currentChallenge.correctCount - correctCount

      // Scoring system
      let points = 0
      if (correctCount === currentChallenge.correctCount && incorrectCount === 0) {
        // Perfect score
        points = 100
      } else {
        // Partial score
        points = Math.max(0, (correctCount * 20) - (incorrectCount * 10) - (missedCount * 5))
      }

      const isSuccess = correctCount >= Math.ceil(currentChallenge.correctCount * 0.7) // 70% benar untuk lulus

      // Auto advance after showing result for 1.5 seconds
      setTimeout(() => {
        const newLives = isSuccess ? prev.lives : Math.max(0, prev.lives - 1)
        
        if (newLives === 0) {
          // Game Over - no more lives
          setGameState('gameOver')
        } else {
          const nextIndex = prev.challengeIndex + 1
          
          if (nextIndex >= prev.challenges.length) {
            // Game completed
            setGameState('completed')
          } else {
            // Next challenge - auto advance regardless of success/failure
            nextChallengeInternal()
          }
        }
      }, 1500)

      return {
        ...prev,
        correctSelections,
        incorrectSelections,
        score: prev.score + points,
        lives: isSuccess ? prev.lives : Math.max(0, prev.lives - 1)
      }
    })
  }, [gameState, currentChallenge, nextChallengeInternal])

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameState === 'playing') {
      interval = setInterval(() => {
        setSession(prev => {
          const newTime = Math.max(0, prev.timeRemaining - 1)
          return {
            ...prev,
            timeRemaining: newTime
          }
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameState])

  // Check for time up
  useEffect(() => {
    if (gameState === 'playing' && session.timeRemaining === 0) {
      checkAnswer()
    }
  }, [gameState, session.timeRemaining, checkAnswer])

  // Mulai game
  const startGame = useCallback(() => {
    const images = generateChallengeImages(currentChallenge)
    setSession(prev => ({
      ...prev,
      currentImages: images,
      selectedImages: [],
      correctSelections: [],
      incorrectSelections: [],
      timeStarted: Date.now(),
      timeRemaining: currentChallenge.timeLimit
    }))
    setGameState('playing')
  }, [currentChallenge])

  // Select/deselect image
  const toggleImageSelection = useCallback((imageId: string) => {
    if (gameState !== 'playing') return

    setSession(prev => {
      const isSelected = prev.selectedImages.includes(imageId)
      const newSelected = isSelected
        ? prev.selectedImages.filter(id => id !== imageId)
        : [...prev.selectedImages, imageId]

      // Cek apakah sudah mencapai batas maksimal
      if (!isSelected && newSelected.length > currentChallenge.correctCount) {
        return prev // Tidak boleh pilih lebih dari batas
      }

      return {
        ...prev,
        selectedImages: newSelected
      }
    })
  }, [gameState, currentChallenge.correctCount])

  // Restart entire game
  const restartGame = useCallback(() => {
    const firstChallenge = guessGameChallenges[0]
    setSession({
      challengeIndex: 0,
      challenges: guessGameChallenges,
      selectedImages: [],
      correctSelections: [],
      incorrectSelections: [],
      score: 0,
      lives: 3,
      maxLives: 3,
      isCompleted: false,
      timeStarted: Date.now(),
      timeRemaining: firstChallenge.timeLimit,
      currentImages: []
    })
    setGameState('instructions')
  }, [])

  // Check if can submit answer
  const canSubmit = session.selectedImages.length > 0
  const isGameOver = session.lives === 0
  const progress = ((session.challengeIndex + 1) / session.challenges.length) * 100

  return {
    // State
    session,
    currentChallenge,
    gameState,
    canSubmit,
    isGameOver,
    progress,

    // Actions
    startGame,
    toggleImageSelection,
    checkAnswer,
    restartGame,

    // Computed
    totalChallenges: session.challenges.length,
    isLastChallenge: session.challengeIndex === session.challenges.length - 1
  }
}
