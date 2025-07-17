// Types for Progression System
export interface UserProgress {
  id: string
  user_id: string
  material_level: number          // Current unlocked material level (1-5)
  quiz_level: number              // Current unlocked quiz level (0-4)
  completed_materials: number[]   // Array of completed material levels
  passed_quizzes: string[]        // Array of passed quiz codes
  total_xp: number               // Total experience points
  streak_days: number            // Consecutive learning days
  last_activity: string          // Last learning date
  created_at: string
  updated_at: string
}

export interface LearningMaterial {
  id: number
  title: string
  slug: string
  level: number                  // 1-5 progression level
  description: string
  duration_minutes: number       // Estimated reading time
  xp_reward: number             // XP for completion
  prerequisite_level?: number    // Required previous level
  content_type: 'reading' | 'interactive' | 'video'
  is_active: boolean
  created_at: string
}

export interface QuizConfig {
  id: string
  quiz_code: string              // GATE_SYMBOLS, BASIC_GATES, etc.
  title: string
  level: number                  // 1-4 progression level
  unlock_material_level: number // Required material level to unlock
  prerequisite_quiz?: string     // Required previous quiz code
  passing_score: number         // Minimum score to pass
  xp_reward_pass: number        // XP for passing
  xp_reward_perfect: number     // XP for perfect score (95%+)
  estimated_time_minutes: number
  difficulty: 'easy' | 'medium' | 'hard'
  is_active: boolean
  created_at: string
}

export interface UserActivityLog {
  id: string
  user_id: string
  activity_type: 'material_read' | 'quiz_completed' | 'quiz_perfect'
  reference_id: string           // material slug or quiz code
  xp_earned: number
  activity_date: string
  created_at: string
}

export interface Achievement {
  id: number
  code: string                   // unique identifier
  title: string
  description: string
  icon: string                   // emoji or icon name
  requirement_type: 'streak' | 'xp' | 'perfect_score' | 'completion'
  requirement_value: number     // threshold to earn
  xp_reward: number
  is_active: boolean
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: number
  achievement?: Achievement      // joined data
  earned_at: string
}

// UI State interfaces
export interface MaterialState {
  material: LearningMaterial
  status: 'locked' | 'available' | 'completed'
  progress?: number              // 0-100 for current material
}

export interface QuizState {
  quiz: QuizConfig
  status: 'locked' | 'available' | 'passed' | 'failed'
  best_score?: number
  attempts_count?: number
  unlock_reason?: string         // Why it's locked
}

export interface ProgressionState {
  userProgress: UserProgress
  materials: MaterialState[]
  quizzes: QuizState[]
  recentAchievements: UserAchievement[]
  canProceedToNext: boolean
}

// Action types for progression updates
export interface ProgressionUpdate {
  activity_type: 'material_read' | 'quiz_completed' | 'quiz_perfect'
  reference_id: string
  xp_earned: number
  material_level?: number
  quiz_level?: number
  completed_material?: number
  passed_quiz?: string
  score?: number
}

// Gamification types
export interface XPReward {
  amount: number
  reason: string
  icon: string
}

export interface LevelUnlock {
  type: 'material' | 'quiz'
  level: number
  title: string
  description: string
}

export interface StreakInfo {
  current: number
  best: number
  next_milestone: number
  is_active: boolean
}

// Dashboard summary
export interface ProgressSummary {
  current_level: number
  total_xp: number
  materials_completed: number
  total_materials: number
  quizzes_passed: number
  total_quizzes: number
  streak_days: number
  recent_activities: UserActivityLog[]
  next_unlock?: {
    type: 'material' | 'quiz'
    title: string
    requirement: string
  }
}
