'use client'

import { useState, useEffect, useCallback } from 'react'
import { QuizQuestion, QuizSession, QuizResult, QuizSettings } from '@/types/quiz'
import { quizManager } from '@/lib/quiz-utils'

export interface UseQuizOptions {
  category?: string
  questionCount?: number
  settings?: QuizSettings
}

export const useQuiz = (options: UseQuizOptions = {}) => {
  const [session, setSession] = useState<QuizSession | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize quiz session
  const startQuiz = useCallback((questions?: QuizQuestion[]) => {
    setIsLoading(true)
    
    try {
      let quizQuestions: QuizQuestion[]
      
      if (questions) {
        quizQuestions = questions
      } else if (options.category) {
        quizQuestions = quizManager.getQuestionsByCategory(options.category)
        if (options.questionCount) {
          quizQuestions = quizManager.getRandomQuestions(options.questionCount, options.category)
        }
      } else {
        quizQuestions = quizManager.getRandomQuestions(options.questionCount || 25)
      }

      const newSession = quizManager.createSession(quizQuestions)
      setSession(newSession)
      setCurrentQuestion(quizQuestions[0] || null)
      setResult(null)
      
      // Set timer if specified
      if (newSession.settings.timeLimit) {
        setTimeRemaining(newSession.settings.timeLimit)
      }
    } catch (error) {
      console.error('Error starting quiz:', error)
    } finally {
      setIsLoading(false)
    }
  }, [options.category, options.questionCount])

  // Answer a question
  const answerQuestion = useCallback((questionId: number, answer: string) => {
    if (!session) return

    const updatedSession = {
      ...session,
      answers: {
        ...session.answers,
        [questionId]: answer
      }
    }
    
    setSession(updatedSession)
  }, [session])

  // Navigate to next question
  const nextQuestion = useCallback(() => {
    if (!session) return

    const nextIndex = session.currentQuestionIndex + 1
    
    if (nextIndex < session.questions.length) {
      const updatedSession = {
        ...session,
        currentQuestionIndex: nextIndex
      }
      setSession(updatedSession)
      setCurrentQuestion(session.questions[nextIndex])
    }
  }, [session])

  // Navigate to previous question
  const previousQuestion = useCallback(() => {
    if (!session) return

    const prevIndex = session.currentQuestionIndex - 1
    
    if (prevIndex >= 0) {
      const updatedSession = {
        ...session,
        currentQuestionIndex: prevIndex
      }
      setSession(updatedSession)
      setCurrentQuestion(session.questions[prevIndex])
    }
  }, [session])

  // Go to specific question
  const goToQuestion = useCallback((index: number) => {
    if (!session || index < 0 || index >= session.questions.length) return

    const updatedSession = {
      ...session,
      currentQuestionIndex: index
    }
    setSession(updatedSession)
    setCurrentQuestion(session.questions[index])
  }, [session])

  // Finish quiz and calculate results
  const finishQuiz = useCallback(() => {
    if (!session) return

    const completedSession = {
      ...session,
      endTime: new Date(),
      isCompleted: true
    }
    
    setSession(completedSession)
    
    const quizResult = quizManager.calculateResults(completedSession)
    setResult(quizResult)
    setTimeRemaining(null)
  }, [session])

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setSession(null)
    setCurrentQuestion(null)
    setResult(null)
    setTimeRemaining(null)
  }, [])

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || !session) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          finishQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, session, finishQuiz])

  // Computed values
  const progress = session 
    ? ((session.currentQuestionIndex + 1) / session.questions.length) * 100
    : 0

  const isFirstQuestion = session?.currentQuestionIndex === 0
  const isLastQuestion = session 
    ? session.currentQuestionIndex === session.questions.length - 1
    : false

  const answeredQuestions = session 
    ? Object.keys(session.answers).length
    : 0

  const canFinish = session 
    ? answeredQuestions === session.questions.length
    : false

  const hasAnswered = currentQuestion && session
    ? currentQuestion.id in session.answers
    : false

  const currentAnswer = currentQuestion && session
    ? session.answers[currentQuestion.id]
    : undefined

  return {
    // State
    session,
    currentQuestion,
    result,
    timeRemaining,
    isLoading,
    
    // Actions
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    finishQuiz,
    resetQuiz,
    
    // Computed values
    progress,
    isFirstQuestion,
    isLastQuestion,
    answeredQuestions,
    canFinish,
    hasAnswered,
    currentAnswer
  }
}
