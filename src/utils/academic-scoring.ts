import { 
  ACADEMIC_GRADING_SCALE, 
  MASTERY_LEVELS, 
  GradingScale, 
  MasteryLevel,
  QuizAttempt,
  UserLearningStats,
  PerformanceAnalytics 
} from '@/types/academic-scoring'

/**
 * Menghitung grade berdasarkan persentase skor
 */
export function calculateGrade(percentage: number): GradingScale {
  return ACADEMIC_GRADING_SCALE.find(scale => 
    percentage >= scale.min_percentage && percentage <= scale.max_percentage
  ) || ACADEMIC_GRADING_SCALE[ACADEMIC_GRADING_SCALE.length - 1]
}

/**
 * Menghitung persentase dari skor
 */
export function calculatePercentage(score: number, maxScore: number): number {
  if (maxScore === 0) return 0
  return Math.round((score / maxScore) * 100 * 100) / 100 // Round to 2 decimal places
}

/**
 * Menentukan level kemahiran berdasarkan statistik pembelajaran
 */
export function determineMasteryLevel(stats: UserLearningStats): MasteryLevel {
  const { average_score, total_quizzes_taken } = stats
  
  // Cari level tertinggi yang memenuhi syarat
  for (let i = MASTERY_LEVELS.length - 1; i >= 0; i--) {
    const level = MASTERY_LEVELS[i]
    if (average_score >= level.min_average_score) {
      // Cek syarat tambahan berdasarkan level
      if (level.level === 'intermediate' && total_quizzes_taken >= 3) return level
      if (level.level === 'advanced' && total_quizzes_taken >= 5) return level
      if (level.level === 'expert' && total_quizzes_taken >= 7) return level
      if (level.level === 'beginner') return level
    }
  }
  
  return MASTERY_LEVELS[0] // Default ke beginner
}

/**
 * Menghitung improvement rate dari beberapa attempt terakhir
 */
export function calculateImprovementRate(attempts: QuizAttempt[]): number {
  if (attempts.length < 2) return 0
  
  // Sortir berdasarkan tanggal
  const sortedAttempts = attempts.sort((a, b) => 
    new Date(a.completed_at || a.started_at).getTime() - 
    new Date(b.completed_at || b.started_at).getTime()
  )
  
  const firstScore = sortedAttempts[0].percentage
  const lastScore = sortedAttempts[sortedAttempts.length - 1].percentage
  
  return Math.round(((lastScore - firstScore) / firstScore) * 100 * 100) / 100
}

/**
 * Menghitung consistency score (konsistensi performa)
 */
export function calculateConsistencyScore(attempts: QuizAttempt[]): number {
  if (attempts.length < 2) return 100
  
  const scores = attempts.map(attempt => attempt.percentage)
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
  
  // Hitung standard deviation
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length
  const standardDeviation = Math.sqrt(variance)
  
  // Convert ke consistency score (0-100, dimana 100 = sangat konsisten)
  const consistencyScore = Math.max(0, 100 - (standardDeviation * 2))
  return Math.round(consistencyScore * 100) / 100
}

/**
 * Memberikan feedback berdasarkan performa
 */
export function generatePerformanceFeedback(
  grade: GradingScale, 
  attempts: QuizAttempt[],
  masteryLevel: MasteryLevel
): {
  message: string
  suggestions: string[]
  achievements: string[]
} {
  const feedback = {
    message: '',
    suggestions: [] as string[],
    achievements: [] as string[]
  }
  
  // Generate message berdasarkan grade
  if (grade.grade === 'A+' || grade.grade === 'A') {
    feedback.message = `Luar biasa! Anda mendapat grade ${grade.grade}. Performa Anda sangat excellent!`
    feedback.achievements.push('🏆 Perfect Score!')
  } else if (grade.grade === 'A-' || grade.grade === 'B+') {
    feedback.message = `Bagus sekali! Grade ${grade.grade} menunjukkan pemahaman yang baik.`
    feedback.achievements.push('⭐ Good Performance!')
  } else if (grade.grade === 'B' || grade.grade === 'B-') {
    feedback.message = `Cukup baik! Grade ${grade.grade} menunjukkan Anda memahami materi dasar.`
    feedback.suggestions.push('💡 Coba review materi yang masih sulit')
  } else if (grade.grade === 'C+' || grade.grade === 'C') {
    feedback.message = `Anda lulus dengan grade ${grade.grade}, namun masih ada ruang untuk improvement.`
    feedback.suggestions.push('📚 Pelajari kembali konsep dasar')
    feedback.suggestions.push('🔄 Coba ulang quiz untuk meningkatkan skor')
  } else {
    feedback.message = `Grade ${grade.grade}. Jangan menyerah! Terus belajar dan berlatih.`
    feedback.suggestions.push('📖 Mulai dari materi yang paling dasar')
    feedback.suggestions.push('⏰ Luangkan lebih banyak waktu untuk belajar')
    feedback.suggestions.push('🎯 Fokus pada satu topik dalam satu waktu')
  }
  
  // Suggestions berdasarkan mastery level
  if (masteryLevel.level === 'beginner') {
    feedback.suggestions.push('🌱 Mulai dengan quiz yang mudah')
    feedback.suggestions.push('📝 Catat konsep penting saat belajar')
  } else if (masteryLevel.level === 'intermediate') {
    feedback.suggestions.push('🚀 Coba tantang diri dengan quiz yang lebih sulit')
    feedback.suggestions.push('🔗 Pelajari hubungan antar konsep')
  } else if (masteryLevel.level === 'advanced') {
    feedback.suggestions.push('🧠 Fokus pada penerapan konsep dalam situasi kompleks')
    feedback.suggestions.push('👥 Bantu teman belajar untuk memperdalam pemahaman')
  }
  
  // Achievements berdasarkan jumlah attempts
  if (attempts.length >= 10) {
    feedback.achievements.push('🎯 Persistent Learner - 10+ Quiz Completed!')
  }
  if (attempts.length >= 5) {
    feedback.achievements.push('📈 Dedicated Student - 5+ Quiz Completed!')
  }
  
  return feedback
}

/**
 * Menghitung efisiensi waktu (skor per detik)
 */
export function calculateTimeEfficiency(score: number, timeSeconds: number): number {
  if (timeSeconds === 0) return 0
  return Math.round((score / timeSeconds) * 100) / 100
}

/**
 * Format waktu dari detik ke format yang mudah dibaca
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes === 0) {
    return `${remainingSeconds} detik`
  } else if (remainingSeconds === 0) {
    return `${minutes} menit`
  } else {
    return `${minutes} menit ${remainingSeconds} detik`
  }
}

/**
 * Menentukan apakah quiz lulus atau tidak
 */
export function isPassingGrade(percentage: number, passingScore: number = 60): boolean {
  return percentage >= passingScore
}

/**
 * Generate analytics summary
 */
export function generateAnalyticsSummary(attempts: QuizAttempt[]): PerformanceAnalytics {
  if (attempts.length === 0) {
    return {
      overall_performance: {
        total_attempts: 0,
        average_score: 0,
        improvement_rate: 0,
        consistency_score: 0
      },
      topic_performance: {},
      time_analytics: {
        average_completion_time: 0,
        fastest_completion: 0,
        efficiency_score: 0
      },
      learning_curve: []
    }
  }
  
  const totalAttempts = attempts.length
  const averageScore = attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts
  const improvementRate = calculateImprovementRate(attempts)
  const consistencyScore = calculateConsistencyScore(attempts)
  
  // Time analytics
  const completedAttempts = attempts.filter(a => a.time_taken_seconds)
  const averageTime = completedAttempts.length > 0 
    ? completedAttempts.reduce((sum, a) => sum + (a.time_taken_seconds || 0), 0) / completedAttempts.length
    : 0
  const fastestTime = completedAttempts.length > 0
    ? Math.min(...completedAttempts.map(a => a.time_taken_seconds || Infinity))
    : 0
  
  // Learning curve
  const learningCurve = attempts
    .sort((a, b) => new Date(a.completed_at || a.started_at).getTime() - new Date(b.completed_at || b.started_at).getTime())
    .map((attempt, index) => {
      const previousAttempts = attempts.slice(0, index + 1)
      const cumulativeAverage = previousAttempts.reduce((sum, a) => sum + a.percentage, 0) / previousAttempts.length
      
      return {
        date: attempt.completed_at || attempt.started_at,
        score: attempt.percentage,
        cumulative_average: Math.round(cumulativeAverage * 100) / 100
      }
    })
  
  return {
    overall_performance: {
      total_attempts: totalAttempts,
      average_score: Math.round(averageScore * 100) / 100,
      improvement_rate: improvementRate,
      consistency_score: consistencyScore
    },
    topic_performance: {}, // Will be populated based on quiz types
    time_analytics: {
      average_completion_time: Math.round(averageTime),
      fastest_completion: fastestTime === Infinity ? 0 : fastestTime,
      efficiency_score: Math.round((averageScore / (averageTime / 60)) * 100) / 100 // score per minute
    },
    learning_curve: learningCurve
  }
}
