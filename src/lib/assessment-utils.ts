"use client"

import { supabase } from '@/lib/supabase'

// Types for saving assessment data
export interface SaveQuizScoreData {
  userId: string
  quizId: string
  quizTitle: string
  score: number
  correctAnswers: number
  totalQuestions: number
  timeTaken?: number
  details?: Record<string, unknown>
}

export interface SaveGameScoreData {
  userId: string
  gameId: string
  gameTitle: string
  gameType: 'challenge' | 'guess' | 'simulator'
  score: number
  levelReached?: number
  livesRemaining?: number
  timeTaken?: number
  details?: Record<string, unknown>
}

export interface UpdateLearningProgressData {
  userId: string
  materialId: string
  materialTitle: string
  status: 'not_started' | 'in_progress' | 'completed' | 'locked'
  progress: number
}

// Save quiz score to database
export async function saveQuizScore(data: SaveQuizScoreData) {
  try {
    // Validate required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const envError = 'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
      console.error('Error saving quiz score:', envError)
      throw new Error(envError)
    }

    // Validate required data fields
    if (!data.userId || !data.quizId || !data.quizTitle) {
      const validationError = 'Missing required quiz score data fields'
      console.error('Error saving quiz score:', validationError, { receivedData: data })
      throw new Error(validationError)
    }

    const grade = calculateGrade(data.score)
    
    const { error } = await supabase
      .from('user_quiz_scores')
      .insert({
        user_id: data.userId,
        quiz_id: data.quizId,
        quiz_title: data.quizTitle,
        score: data.score,
        correct_answers: data.correctAnswers,
        total_questions: data.totalQuestions,
        time_taken: data.timeTaken,
        grade: grade,
        details: data.details || {}
      })

    if (error) {
      const errorMessage = `Supabase database error: ${error.message || 'Unknown error'}`
      console.error('Error saving quiz score:', errorMessage, {
        code: error.code,
        details: error.details,
        hint: error.hint,
        quizData: data
      })
      return { success: false, error: errorMessage }
    }

    console.log('Quiz score saved successfully for user:', data.userId, 'quiz:', data.quizId)
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Error saving quiz score - Unexpected error:', errorMessage, {
      error: error,
      quizData: data,
      stack: error instanceof Error ? error.stack : undefined
    })
    return { success: false, error: errorMessage }
  }
}

// Save game score to database
export async function saveGameScore(data: SaveGameScoreData) {
  try {
    // Validate required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const envError = 'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
      console.error('Error saving game score:', envError)
      throw new Error(envError)
    }

    // Validate required data fields
    if (!data.userId || !data.gameId || !data.gameTitle || !data.gameType) {
      const validationError = 'Missing required game score data fields'
      console.error('Error saving game score:', validationError, { receivedData: data })
      throw new Error(validationError)
    }

    const { error } = await supabase
      .from('user_game_scores')
      .insert({
        user_id: data.userId,
        game_id: data.gameId,
        game_title: data.gameTitle,
        game_type: data.gameType,
        score: data.score,
        level_reached: data.levelReached || 1,
        lives_remaining: data.livesRemaining || 0,
        time_taken: data.timeTaken,
        details: data.details || {}
      })

    if (error) {
      const errorMessage = `Supabase database error: ${error.message || 'Unknown error'}`
      console.error('Error saving game score:', errorMessage, {
        code: error.code,
        details: error.details,
        hint: error.hint,
        gameData: data
      })
      return { success: false, error: errorMessage }
    }

    console.log('Game score saved successfully for user:', data.userId, 'game:', data.gameId)
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Error saving game score - Unexpected error:', errorMessage, {
      error: error,
      gameData: data,
      stack: error instanceof Error ? error.stack : undefined
    })
    return { success: false, error: errorMessage }
  }
}

// Update learning progress
export async function updateLearningProgress(data: UpdateLearningProgressData) {
  try {
    const updateData: {
      material_title: string
      status: string
      progress: number
      last_accessed_at: string
      updated_at: string
      completed_at?: string
      started_at?: string
    } = {
      material_title: data.materialTitle,
      status: data.status,
      progress: data.progress,
      last_accessed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Set completion time if completing for the first time
    if (data.status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    // Set start time if starting for the first time
    if (data.status === 'in_progress') {
      updateData.started_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('user_learning_progress')
      .upsert({
        user_id: data.userId,
        material_id: data.materialId,
        ...updateData
      }, {
        onConflict: 'user_id,material_id'
      })

    if (error) {
      console.error('Error updating learning progress:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating learning progress:', error)
    return { success: false, error }
  }
}

// Initialize user learning progress with default materials
export async function initializeUserProgress(userId: string) {
  try {
    const defaultMaterials = [
      { id: 'pengenalan', title: 'Pengenalan Gerbang Logika' },
      { id: 'gerbang-dasar', title: 'Gerbang Dasar (AND, OR, NOT)' },
      { id: 'gerbang-kombinasi', title: 'Gerbang Kombinasi (NAND, NOR)' },
      { id: 'gerbang-xor', title: 'Gerbang XOR dan XNOR' },
      { id: 'kombinasi', title: 'Kombinasi Gerbang Logika' },
      { id: 'aplikasi', title: 'Aplikasi Praktis' },
      { id: 'rangkaian', title: 'Rangkaian Digital' },
      { id: 'proyek', title: 'Proyek Akhir' }
    ]

    const progressData = defaultMaterials.map((material, index) => ({
      user_id: userId,
      material_id: material.id,
      material_title: material.title,
      status: index === 0 ? 'not_started' : 'locked', // First material unlocked
      progress: 0
    }))

    const { error } = await supabase
      .from('user_learning_progress')
      .upsert(progressData, {
        onConflict: 'user_id,material_id',
        ignoreDuplicates: true
      })

    if (error) {
      console.error('Error initializing user progress:', error)
      return { success: false, error }
    }

    // Also initialize user statistics
    const { error: statsError } = await supabase
      .from('user_statistics')
      .upsert({
        user_id: userId,
        total_score: 0,
        total_quizzes_completed: 0,
        total_games_completed: 0,
        total_materials_completed: 0,
        best_quiz_score: 0,
        best_game_score: 0,
        current_level: 'Pemula',
        total_study_time: 0,
        streak_days: 0,
        achievements: []
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: true
      })

    if (statsError) {
      console.error('Error initializing user statistics:', statsError)
    }

    return { success: true }
  } catch (error) {
    console.error('Error initializing user progress:', error)
    return { success: false, error }
  }
}

// Helper function to calculate grade from score
function calculateGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

// Get user's current statistics
export async function getUserStatistics(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error getting user statistics:', error)
      return { success: false, error }
    }

    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error getting user statistics:', error)
    return { success: false, error }
  }
}

// Check if user needs progress initialization
export async function checkAndInitializeUser(userId: string) {
  try {
    const { data: existingProgress } = await supabase
      .from('user_learning_progress')
      .select('id')
      .eq('user_id', userId)
      .limit(1)

    if (!existingProgress || existingProgress.length === 0) {
      await initializeUserProgress(userId)
    }

    return { success: true }
  } catch (error) {
    console.error('Error checking user initialization:', error)
    return { success: false, error }
  }
}
