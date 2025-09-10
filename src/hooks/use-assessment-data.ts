"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { supabase } from '@/lib/supabase'
import { checkAndInitializeUser } from '@/lib/assessment-utils'

// Types untuk assessment data
export interface AssessmentOverview {
  totalScore: number
  averageQuizScore: number
  averageGameScore: number
  totalQuizzes: number
  totalGames: number
  currentLevel: string
  completedMaterials: number
}

export interface LearningMaterial {
  title: string
  status: 'completed' | 'in_progress' | 'locked' | 'not_started'
  progress: number
  completedAt?: string
  url: string
}

export interface LearningProgress {
  overallProgress: number
  completedMaterials: number
  totalMaterials: number
  materials: LearningMaterial[]
}

export interface ScoreRecord {
  title: string
  type: 'quiz' | 'game'
  score: number
  correctAnswers?: number
  totalQuestions?: number
  timeTaken?: number
  completedAt: string
  isPersonalBest: boolean
}

export interface ScoreHistory {
  records: ScoreRecord[]
  bestQuizScore: number
  bestGameScore: number
}

// Mock data untuk development (nanti akan diganti dengan data dari Supabase)
const MOCK_LEARNING_MATERIALS: LearningMaterial[] = [
  {
    title: "Pengenalan Gerbang Logika",
    status: "completed",
    progress: 100,
    completedAt: "2024-01-15",
    url: "/materi/pengenalan"
  },
  {
    title: "Gerbang Dasar (AND, OR, NOT)",
    status: "completed", 
    progress: 100,
    completedAt: "2024-01-16",
    url: "/materi/gerbang-dasar"
  },
  {
    title: "Gerbang Kombinasi (NAND, NOR)",
    status: "in_progress",
    progress: 75,
    url: "/materi/gerbang-kombinasi"
  },
  {
    title: "Gerbang XOR dan XNOR", 
    status: "in_progress",
    progress: 30,
    url: "/materi/gerbang-xor"
  },
  {
    title: "Kombinasi Gerbang Logika",
    status: "not_started",
    progress: 0,
    url: "/materi/kombinasi"
  },
  {
    title: "Aplikasi Praktis",
    status: "locked",
    progress: 0,
    url: "/materi/aplikasi"
  },
  {
    title: "Rangkaian Digital",
    status: "locked", 
    progress: 0,
    url: "/materi/rangkaian"
  },
  {
    title: "Proyek Akhir",
    status: "locked",
    progress: 0,
    url: "/materi/proyek"
  }
]

const MOCK_SCORE_RECORDS: ScoreRecord[] = [
  {
    title: "Kuis Gerbang Dasar",
    type: "quiz",
    score: 85,
    correctAnswers: 17,
    totalQuestions: 20,
    timeTaken: 180,
    completedAt: "2024-01-16T10:30:00Z",
    isPersonalBest: false
  },
  {
    title: "Challenge Game Level 1",
    type: "game", 
    score: 92,
    timeTaken: 240,
    completedAt: "2024-01-16T14:20:00Z",
    isPersonalBest: true
  },
  {
    title: "Kuis Gerbang Kombinasi",
    type: "quiz",
    score: 78,
    correctAnswers: 14,
    totalQuestions: 18,
    timeTaken: 220,
    completedAt: "2024-01-17T09:15:00Z",
    isPersonalBest: false
  },
  {
    title: "Guess Game Logic Gates",
    type: "game",
    score: 88,
    timeTaken: 195,
    completedAt: "2024-01-17T15:45:00Z",
    isPersonalBest: false
  },
  {
    title: "Kuis XOR dan XNOR",
    type: "quiz",
    score: 90,
    correctAnswers: 18,
    totalQuestions: 20,
    timeTaken: 165,
    completedAt: "2024-01-18T11:10:00Z",
    isPersonalBest: true
  }
]

export function useAssessmentData() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [overviewData, setOverviewData] = useState<AssessmentOverview>({
    totalScore: 0,
    averageQuizScore: 0,
    averageGameScore: 0,
    totalQuizzes: 0,
    totalGames: 0,
    currentLevel: "Pemula",
    completedMaterials: 0
  })
  const [learningProgress, setLearningProgress] = useState<LearningProgress>({
    overallProgress: 0,
    completedMaterials: 0,
    totalMaterials: 8,
    materials: []
  })
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory>({
    records: [],
    bestQuizScore: 0,
    bestGameScore: 0
  })

  const loadAssessmentData = useCallback(async () => {
    setLoading(true)
    
    try {
      if (user?.id) {
        // Initialize user data if needed
        await checkAndInitializeUser(user.id)
        // Load data from Supabase
        await loadDataFromSupabase(user.id)
      } else {
        // Fallback to mock data for development
        await loadMockData()
      }
    } catch (error) {
      console.error('Error loading assessment data:', error)
      // Fallback to mock data on error
      await loadMockData()
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadAssessmentData()
  }, [loadAssessmentData])

  const loadDataFromSupabase = async (userId: string) => {
    // Load user statistics
    const { data: stats } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Load learning progress
    const { data: progress } = await supabase
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at')

    // Load quiz scores
    const { data: quizScores } = await supabase
      .from('user_quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(20)

    // Load game scores
    const { data: gameScores } = await supabase
      .from('user_game_scores')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(20)

    // Process and set the data
    if (stats) {
      const averageQuizScore = stats.total_quizzes_completed > 0 
        ? Math.round((quizScores?.reduce((sum, s) => sum + s.score, 0) || 0) / stats.total_quizzes_completed)
        : 0

      const averageGameScore = stats.total_games_completed > 0
        ? Math.round((gameScores?.reduce((sum, s) => sum + s.score, 0) || 0) / stats.total_games_completed)
        : 0

      setOverviewData({
        totalScore: stats.total_score || 0,
        averageQuizScore,
        averageGameScore,
        totalQuizzes: stats.total_quizzes_completed || 0,
        totalGames: stats.total_games_completed || 0,
        currentLevel: stats.current_level || "Pemula",
        completedMaterials: stats.total_materials_completed || 0
      })
    }

    // Process learning progress
    if (progress) {
      const totalMaterials = 8
      const completedMaterials = progress.filter(p => p.status === 'completed').length
      const overallProgress = (completedMaterials / totalMaterials) * 100

      const materials: LearningMaterial[] = progress.map(p => ({
        title: p.material_title,
        status: p.status as LearningMaterial['status'],
        progress: p.progress || 0,
        completedAt: p.completed_at,
        url: `/materi/${p.material_id}`
      }))

      setLearningProgress({
        overallProgress,
        completedMaterials,
        totalMaterials,
        materials
      })
    }

    // Process score history
    const allScores: ScoreRecord[] = [
      ...(quizScores?.map(q => ({
        title: q.quiz_title,
        type: 'quiz' as const,
        score: q.score,
        correctAnswers: q.correct_answers,
        totalQuestions: q.total_questions,
        timeTaken: q.time_taken,
        completedAt: q.completed_at,
        isPersonalBest: q.score === stats?.best_quiz_score
      })) || []),
      ...(gameScores?.map(g => ({
        title: g.game_title,
        type: 'game' as const,
        score: g.score,
        timeTaken: g.time_taken,
        completedAt: g.completed_at,
        isPersonalBest: g.score === stats?.best_game_score
      })) || [])
    ].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

    setScoreHistory({
      records: allScores,
      bestQuizScore: stats?.best_quiz_score || 0,
      bestGameScore: stats?.best_game_score || 0
    })
  }

  const loadMockData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const completedMaterials = MOCK_LEARNING_MATERIALS.filter(m => m.status === 'completed').length
    const totalMaterials = MOCK_LEARNING_MATERIALS.length
    const overallProgress = (completedMaterials / totalMaterials) * 100

    // Calculate quiz and game averages
    const quizRecords = MOCK_SCORE_RECORDS.filter(r => r.type === 'quiz')
    const gameRecords = MOCK_SCORE_RECORDS.filter(r => r.type === 'game')
    
    const averageQuizScore = quizRecords.length > 0 
      ? Math.round(quizRecords.reduce((sum, r) => sum + r.score, 0) / quizRecords.length)
      : 0
    
    const averageGameScore = gameRecords.length > 0
      ? Math.round(gameRecords.reduce((sum, r) => sum + r.score, 0) / gameRecords.length)
      : 0

    const totalScore = MOCK_SCORE_RECORDS.reduce((sum, r) => sum + r.score, 0)

    // Determine current level based on progress
    let currentLevel = "Pemula"
    if (overallProgress >= 80) currentLevel = "Ahli"
    else if (overallProgress >= 50) currentLevel = "Menengah"
    else if (overallProgress >= 25) currentLevel = "Dasar"

    const bestQuizScore = quizRecords.length > 0 ? Math.max(...quizRecords.map(r => r.score)) : 0
    const bestGameScore = gameRecords.length > 0 ? Math.max(...gameRecords.map(r => r.score)) : 0

    setOverviewData({
      totalScore,
      averageQuizScore,
      averageGameScore,
      totalQuizzes: quizRecords.length,
      totalGames: gameRecords.length,
      currentLevel,
      completedMaterials
    })

    setLearningProgress({
      overallProgress,
      completedMaterials,
      totalMaterials,
      materials: MOCK_LEARNING_MATERIALS
    })

    setScoreHistory({
      records: MOCK_SCORE_RECORDS.sort((a, b) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      ),
      bestQuizScore,
      bestGameScore
    })
  }

  return {
    overviewData,
    learningProgress, 
    scoreHistory,
    loading,
    refreshData: loadAssessmentData
  }
}
