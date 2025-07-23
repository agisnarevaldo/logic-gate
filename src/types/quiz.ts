export interface QuizOption {
  id: string
  text: string
  value: string // a, b, c, d, e
}

export interface QuizQuestion {
  id: number
  question: string
  image?: string
  optionsImage?: string // Gambar untuk pilihan jawaban
  options: QuizOption[]
  correctAnswer: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  explanation?: string
}

export interface QuizSession {
  id: string
  questions: QuizQuestion[]
  currentQuestionIndex: number
  answers: Record<number, string>
  startTime: Date
  endTime: Date | null
  isCompleted: boolean
  settings: QuizSettings
}

export interface QuizResult {
  sessionId: string
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  scorePercentage: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  timeTaken: number
  completedAt: Date
  categoryBreakdown: Record<string, { correct: number; total: number }>
}

export interface QuizSettings {
  randomizeQuestions?: boolean
  randomizeOptions?: boolean
  timeLimit?: number | null
  showCorrectAnswer?: boolean
  allowReview?: boolean
}
