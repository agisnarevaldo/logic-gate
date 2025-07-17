// Types untuk sistem penilaian akademik

export interface QuizType {
  id: string
  name: string
  code: string
  description?: string
  max_score: number
  passing_score: number
  time_limit_minutes?: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
  updated_at: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_type_id: string
  score: number
  max_possible_score: number
  percentage: number
  grade?: string
  time_taken_seconds?: number
  correct_answers: number
  total_questions: number
  detailed_results?: QuizDetailedResults
  started_at: string
  completed_at?: string
  created_at: string
}

export interface QuizDetailedResults {
  questions: QuestionResult[]
  summary: {
    total_questions: number
    correct_answers: number
    incorrect_answers: number
    time_taken_seconds: number
    difficulty_breakdown?: {
      easy: { correct: number; total: number }
      medium: { correct: number; total: number }
      hard: { correct: number; total: number }
    }
  }
}

export interface QuestionResult {
  question_id: string
  question_text?: string
  user_answer: string | string[] | number | boolean
  correct_answer: string | string[] | number | boolean
  is_correct: boolean
  time_taken_seconds?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  topic?: string
  explanation?: string
}

export interface UserLearningStats {
  id: string
  user_id: string
  total_quizzes_taken: number
  total_score: number
  average_score: number
  highest_score: number
  total_time_spent_seconds: number
  mastery_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  last_activity?: string
  created_at: string
  updated_at: string
}

export interface TopicProgress {
  id: string
  user_id: string
  topic_code: string
  mastery_percentage: number
  attempts_count: number
  best_score: number
  last_attempt_at?: string
  created_at: string
  updated_at: string
}

// Academic grading system
export interface GradingScale {
  grade: string
  min_percentage: number
  max_percentage: number
  description: string
  gpa_points: number
}

export const ACADEMIC_GRADING_SCALE: GradingScale[] = [
  { grade: 'A+', min_percentage: 95, max_percentage: 100, description: 'Excellent', gpa_points: 4.0 },
  { grade: 'A', min_percentage: 90, max_percentage: 94, description: 'Very Good', gpa_points: 3.7 },
  { grade: 'A-', min_percentage: 85, max_percentage: 89, description: 'Good', gpa_points: 3.3 },
  { grade: 'B+', min_percentage: 80, max_percentage: 84, description: 'Above Average', gpa_points: 3.0 },
  { grade: 'B', min_percentage: 75, max_percentage: 79, description: 'Average', gpa_points: 2.7 },
  { grade: 'B-', min_percentage: 70, max_percentage: 74, description: 'Below Average', gpa_points: 2.3 },
  { grade: 'C+', min_percentage: 65, max_percentage: 69, description: 'Satisfactory', gpa_points: 2.0 },
  { grade: 'C', min_percentage: 60, max_percentage: 64, description: 'Minimum Pass', gpa_points: 1.7 },
  { grade: 'D', min_percentage: 50, max_percentage: 59, description: 'Poor', gpa_points: 1.0 },
  { grade: 'F', min_percentage: 0, max_percentage: 49, description: 'Fail', gpa_points: 0.0 },
]

// Mastery levels
export interface MasteryLevel {
  level: string
  min_average_score: number
  description: string
  requirements: string[]
}

export const MASTERY_LEVELS: MasteryLevel[] = [
  {
    level: 'beginner',
    min_average_score: 0,
    description: 'Pemula - Baru memulai pembelajaran',
    requirements: ['Selesaikan minimal 1 quiz']
  },
  {
    level: 'intermediate',
    min_average_score: 70,
    description: 'Menengah - Memahami konsep dasar',
    requirements: ['Rata-rata skor ≥ 70%', 'Selesaikan minimal 3 quiz']
  },
  {
    level: 'advanced',
    min_average_score: 85,
    description: 'Lanjutan - Menguasai sebagian besar konsep',
    requirements: ['Rata-rata skor ≥ 85%', 'Selesaikan minimal 5 quiz']
  },
  {
    level: 'expert',
    min_average_score: 95,
    description: 'Ahli - Menguasai semua konsep',
    requirements: ['Rata-rata skor ≥ 95%', 'Selesaikan semua quiz']
  }
]

// Quiz question types
export type QuestionType = 'multiple_choice' | 'matching' | 'true_false' | 'fill_blank' | 'drag_drop'

export interface QuizQuestion {
  id: string
  type: QuestionType
  question: string
  options?: string[]
  correct_answer: string | string[] | number | boolean
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  explanation?: string
  points: number
}

// Performance analytics
export interface PerformanceAnalytics {
  overall_performance: {
    total_attempts: number
    average_score: number
    improvement_rate: number
    consistency_score: number
  }
  topic_performance: {
    [topic: string]: {
      attempts: number
      best_score: number
      average_score: number
      mastery_percentage: number
    }
  }
  time_analytics: {
    average_completion_time: number
    fastest_completion: number
    efficiency_score: number
  }
  learning_curve: {
    date: string
    score: number
    cumulative_average: number
  }[]
}
