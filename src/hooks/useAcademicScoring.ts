"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { academicScoringService } from '@/services/academic-scoring'
import { 
  QuizType, 
  QuizAttempt, 
  UserLearningStats, 
  TopicProgress,
  QuizDetailedResults,
  PerformanceAnalytics 
} from '@/types/academic-scoring'
import { 
  calculateGrade, 
  determineMasteryLevel, 
  generatePerformanceFeedback,
  generateAnalyticsSummary 
} from '@/utils/academic-scoring'

export function useAcademicScoring() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State untuk data
  const [quizTypes, setQuizTypes] = useState<QuizType[]>([])
  const [userStats, setUserStats] = useState<UserLearningStats | null>(null)
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([])
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([])

  /**
   * Load initial data
   */
  const loadInitialData = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const [types, stats, attempts, progress] = await Promise.all([
        academicScoringService.getQuizTypes(),
        academicScoringService.getUserLearningStats(),
        academicScoringService.getUserQuizAttempts(10),
        academicScoringService.getUserTopicProgress()
      ])

      setQuizTypes(types)
      setUserStats(stats)
      setRecentAttempts(attempts)
      setTopicProgress(progress)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error loading academic data:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  /**
   * Start a new quiz attempt
   */
  const startQuizAttempt = useCallback(async (
    quizTypeCode: string, 
    totalQuestions: number
  ): Promise<string | null> => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const attemptId = await academicScoringService.createQuizAttempt(
        quizTypeCode, 
        totalQuestions
      )
      return attemptId
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start quiz')
      console.error('Error starting quiz:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [user])

  /**
   * Complete a quiz attempt
   */
  const completeQuizAttempt = useCallback(async (
    attemptId: string,
    correctAnswers: number,
    totalQuestions: number,
    timeSpentSeconds: number,
    detailedResults: QuizDetailedResults
  ): Promise<QuizAttempt | null> => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const completedAttempt = await academicScoringService.completeQuizAttempt(
        attemptId,
        correctAnswers,
        totalQuestions,
        timeSpentSeconds,
        detailedResults
      )

      // Refresh data after completion
      await loadInitialData()

      return completedAttempt
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete quiz')
      console.error('Error completing quiz:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [user, loadInitialData])

  /**
   * Get quiz attempts for specific quiz type
   */
  const getQuizTypeAttempts = useCallback(async (
    quizTypeCode: string
  ): Promise<QuizAttempt[]> => {
    if (!user) return []

    try {
      return await academicScoringService.getQuizTypeAttempts(quizTypeCode)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attempts')
      console.error('Error fetching quiz type attempts:', err)
      return []
    }
  }, [user])

  /**
   * Get performance analytics
   */
  const getPerformanceAnalytics = useCallback((): PerformanceAnalytics | null => {
    if (recentAttempts.length === 0) return null
    return generateAnalyticsSummary(recentAttempts)
  }, [recentAttempts])

  /**
   * Get current mastery level
   */
  const getCurrentMasteryLevel = useCallback(() => {
    if (!userStats) return null
    return determineMasteryLevel(userStats)
  }, [userStats])

  /**
   * Get performance feedback for latest attempt
   */
  const getLatestPerformanceFeedback = useCallback(() => {
    if (recentAttempts.length === 0 || !userStats) return null

    const latestAttempt = recentAttempts[0]
    const grade = calculateGrade(latestAttempt.percentage)
    const masteryLevel = determineMasteryLevel(userStats)

    return generatePerformanceFeedback(grade, recentAttempts, masteryLevel)
  }, [recentAttempts, userStats])

  /**
   * Reset user progress (for development/testing)
   */
  const resetProgress = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      await academicScoringService.resetUserProgress()
      await loadInitialData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset progress')
      console.error('Error resetting progress:', err)
    } finally {
      setLoading(false)
    }
  }, [user, loadInitialData])

  /**
   * Refresh all data
   */
  const refreshData = useCallback(async () => {
    await loadInitialData()
  }, [loadInitialData])

  return {
    // Data
    quizTypes,
    userStats,
    recentAttempts,
    topicProgress,
    
    // Loading states
    loading,
    error,
    
    // Actions
    startQuizAttempt,
    completeQuizAttempt,
    getQuizTypeAttempts,
    resetProgress,
    refreshData,
    
    // Computed values
    getPerformanceAnalytics,
    getCurrentMasteryLevel,
    getLatestPerformanceFeedback,
    
    // Helper functions
    calculateGrade,
    
    // Status checks
    isAuthenticated: !!user
  }
}
