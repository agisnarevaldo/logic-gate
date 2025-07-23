import { QuizQuestion, QuizSession, QuizResult, QuizSettings } from '@/types/quiz'
import quizData from '@/data/quiz-questions.json'

export class QuizManager {
  private questions: QuizQuestion[]
  private settings: QuizSettings

  constructor(settings: QuizSettings = {}) {
    this.questions = quizData.questions as QuizQuestion[]
    this.settings = {
      randomizeQuestions: false,
      randomizeOptions: false,
      timeLimit: null,
      showCorrectAnswer: true,
      allowReview: true,
      ...settings
    }
  }

  /**
   * Get questions by category
   */
  getQuestionsByCategory(category: string): QuizQuestion[] {
    return this.questions.filter(q => q.category === category)
  }

  /**
   * Get questions by difficulty
   */
  getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] {
    return this.questions.filter(q => q.difficulty === difficulty)
  }

  /**
   * Get random questions
   */
  getRandomQuestions(count: number, category?: string): QuizQuestion[] {
    let availableQuestions = category 
      ? this.getQuestionsByCategory(category)
      : this.questions

    if (this.settings.randomizeQuestions) {
      availableQuestions = this.shuffleArray([...availableQuestions])
    }

    const selectedQuestions = availableQuestions.slice(0, count)

    if (this.settings.randomizeOptions) {
      return selectedQuestions.map(q => ({
        ...q,
        options: this.shuffleArray([...q.options])
      }))
    }

    return selectedQuestions
  }

  /**
   * Create a new quiz session
   */
  createSession(questions: QuizQuestion[]): QuizSession {
    return {
      id: this.generateSessionId(),
      questions,
      currentQuestionIndex: 0,
      answers: {},
      startTime: new Date(),
      endTime: null,
      isCompleted: false,
      settings: this.settings
    }
  }

  /**
   * Calculate quiz results
   */
  calculateResults(session: QuizSession): QuizResult {
    const { questions, answers } = session
    let correctAnswers = 0
    const totalQuestions = questions.length

    // Calculate score
    questions.forEach(question => {
      const userAnswer = answers[question.id]
      if (userAnswer === question.correctAnswer) {
        correctAnswers++
      }
    })

    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100)

    // Determine grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F'
    if (scorePercentage >= 90) grade = 'A'
    else if (scorePercentage >= 80) grade = 'B'
    else if (scorePercentage >= 70) grade = 'C'
    else if (scorePercentage >= 60) grade = 'D'
    else grade = 'F'

    // Calculate time taken
    const timeTaken = session.endTime && session.startTime 
      ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000)
      : 0

    // Category breakdown
    const categoryBreakdown: Record<string, { correct: number; total: number }> = {}
    questions.forEach(question => {
      const category = question.category
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { correct: 0, total: 0 }
      }
      categoryBreakdown[category].total++
      
      const userAnswer = answers[question.id]
      if (userAnswer === question.correctAnswer) {
        categoryBreakdown[category].correct++
      }
    })

    return {
      sessionId: session.id,
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      scorePercentage,
      grade,
      timeTaken,
      completedAt: new Date(),
      categoryBreakdown
    }
  }

  /**
   * Get all available categories
   */
  getCategories(): string[] {
    const categories = new Set(this.questions.map(q => q.category))
    return Array.from(categories).sort()
  }

  /**
   * Get question by ID
   */
  getQuestionById(id: number): QuizQuestion | undefined {
    return this.questions.find(q => q.id === id)
  }

  /**
   * Shuffle array utility
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Export singleton instance
export const quizManager = new QuizManager()

// Utility functions for components
export const getCategoryName = (category: string): string => {
  const categoryNames: Record<string, string> = {
    'basic-gates': 'Gerbang Dasar',
    'truth-table': 'Tabel Kebenaran', 
    'boolean-algebra': 'Aljabar Boolean',
    'combinational': 'Rangkaian Kombinasi',
    'applications': 'Aplikasi'
  }
  return categoryNames[category] || category
}

export const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    'easy': 'text-green-600 bg-green-100',
    'medium': 'text-yellow-600 bg-yellow-100', 
    'hard': 'text-red-600 bg-red-100'
  }
  return colors[difficulty] || 'text-gray-600 bg-gray-100'
}

export const getDifficultyName = (difficulty: string): string => {
  const names: Record<string, string> = {
    'easy': 'Mudah',
    'medium': 'Sedang',
    'hard': 'Sulit'
  }
  return names[difficulty] || difficulty
}
