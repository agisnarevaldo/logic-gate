'use client'

import { useState, useCallback } from 'react'
import { Challenge, ChallengeSession } from '@/types/challenge'
import challengeData from '@/data/challenges.json'

type GameState = 'playing' | 'checking' | 'completed'

export const useChallengeGame = () => {
  const [session, setSession] = useState<ChallengeSession>({
    currentChallengeIndex: 0,
    challenges: challengeData.challenges as Challenge[],
    score: 0,
    completed: false,
    answers: {}
  })

  const [gameState, setGameState] = useState<GameState>('playing')
  const [lastResult, setLastResult] = useState<{ correct: boolean; explanation: string } | null>(null)

  const currentChallenge = session.challenges[session.currentChallengeIndex]

  // Calculate logic gate output
  const calculateOutput = (gateType: string, inputs: boolean[]): boolean => {
    switch (gateType) {
      case 'AND':
        return inputs.every(input => input)
      case 'OR':
        return inputs.some(input => input)
      case 'NOT':
        return !inputs[0]
      case 'NAND':
        return !inputs.every(input => input)
      case 'NOR':
        return !inputs.some(input => input)
      case 'XOR':
        return inputs.filter(input => input).length === 1
      case 'XNOR':
        return inputs.filter(input => input).length !== 1
      default:
        return false
    }
  }

  // Check if the selected answer is correct
  const checkAnswer = useCallback((selectedGate: string): boolean => {
    if (!currentChallenge) return false
    
    // Get input values from the challenge
    const inputValues: boolean[] = []
    const missingComponent = currentChallenge.components.find(
      comp => comp.id === currentChallenge.missingComponentId
    )
    
    if (!missingComponent) return false

    // Get actual input values based on connections
    missingComponent.inputs.forEach(input => {
      // Find which input component connects to this input
      const connection = currentChallenge.connections.find(
        conn => conn.to.componentId === missingComponent.id && conn.to.portId === input.id
      )
      
      if (connection) {
        const inputComponentId = connection.from.componentId
        const inputValue = currentChallenge.inputValues[inputComponentId] ?? false
        inputValues.push(inputValue)
      }
    })

    // Calculate what the output should be with the selected gate
    const calculatedOutput = calculateOutput(selectedGate, inputValues)
    
    // Check if it matches the expected output
    return calculatedOutput === currentChallenge.expectedOutput
  }, [currentChallenge])

  // Set user answer for a missing component
  const setUserAnswer = useCallback((challengeId: string, gateType: string) => {
    const id = parseInt(challengeId)
    setSession(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [id]: gateType
      }
    }))
  }, [])

  // Check current answers
  const checkCurrentAnswer = useCallback(() => {
    if (!currentChallenge) return
    
    const selectedGate = session.answers[currentChallenge.id]
    if (!selectedGate) return

    setGameState('checking')
    
    const isCorrect = checkAnswer(selectedGate)
    
    setLastResult({ 
      correct: isCorrect, 
      explanation: currentChallenge.explanation || '' 
    })

    if (isCorrect) {
      setSession(prev => ({
        ...prev,
        score: prev.score + 1
      }))
    }

    setTimeout(() => {
      setGameState('completed')
    }, 1000)
  }, [currentChallenge, session.answers, checkAnswer])

  // Submit an answer (legacy method for compatibility)
  const submitAnswer = useCallback((selectedGate: string) => {
    if (!currentChallenge) return { correct: false, explanation: '' }

    const isCorrect = checkAnswer(selectedGate)
    
    setSession(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentChallenge.id]: selectedGate
      },
      score: isCorrect ? prev.score + 1 : prev.score
    }))

    return {
      correct: isCorrect,
      explanation: currentChallenge.explanation || '',
      correctAnswer: currentChallenge.correctAnswer
    }
  }, [currentChallenge, checkAnswer])

  // Move to next challenge
  const nextChallenge = useCallback(() => {
    setSession(prev => {
      const nextIndex = prev.currentChallengeIndex + 1
      const completed = nextIndex >= prev.challenges.length
      
      return {
        ...prev,
        currentChallengeIndex: completed ? prev.currentChallengeIndex : nextIndex,
        completed
      }
    })
  }, [])

  // Reset the game
  const resetGame = useCallback(() => {
    setSession({
      currentChallengeIndex: 0,
      challenges: challengeData.challenges as Challenge[],
      score: 0,
      completed: false,
      answers: {}
    })
    setGameState('playing')
    setLastResult(null)
  }, [])

  // Restart current challenge
  const restartCurrentChallenge = useCallback(() => {
    setSession(prev => {
      const newAnswers = { ...prev.answers }
      delete newAnswers[currentChallenge.id]
      
      return {
        ...prev,
        answers: newAnswers
      }
    })
    setGameState('playing')
    setLastResult(null)
  }, [currentChallenge])

  // Get final results
  const getResults = useCallback(() => {
    const totalChallenges = session.challenges.length
    const correctAnswers = session.score
    const percentage = Math.round((correctAnswers / totalChallenges) * 100)
    
    let grade = 'F'
    if (percentage >= 90) grade = 'A'
    else if (percentage >= 80) grade = 'B'
    else if (percentage >= 70) grade = 'C'
    else if (percentage >= 60) grade = 'D'

    return {
      totalChallenges,
      correctAnswers,
      percentage,
      grade
    }
  }, [session])

  return {
    // Session data
    session,
    currentChallenge,
    challengeIndex: session.currentChallengeIndex,
    
    // Game state
    gameState,
    userAnswers: session.answers,
    score: session.score,
    totalChallenges: session.challenges.length,
    isCorrect: lastResult?.correct ?? false,
    
    // Actions
    setUserAnswer,
    checkAnswer: checkCurrentAnswer,
    submitAnswer,
    nextChallenge,
    restartGame: resetGame,
    restartCurrentChallenge,
    getResults,
    
    // Computed
    isLastChallenge: session.currentChallengeIndex === session.challenges.length - 1,
    progress: ((session.currentChallengeIndex + 1) / session.challenges.length) * 100
  }
}
