import { createClient } from '@/lib/supabase/client'
import { 
  QuizType, 
  QuizAttempt, 
  UserLearningStats, 
  TopicProgress,
  QuizDetailedResults 
} from '@/types/academic-scoring'
import { calculateGrade, calculatePercentage } from '@/utils/academic-scoring'

class AcademicScoringService {
  private supabase = createClient()

  /**
   * Mendapatkan semua jenis quiz yang tersedia
   */
  async getQuizTypes(): Promise<QuizType[]> {
    const { data, error } = await this.supabase
      .from('quiz_types')
      .select('*')
      .order('difficulty_level', { ascending: true })

    if (error) {
      console.error('Error fetching quiz types:', error)
      throw new Error('Failed to fetch quiz types')
    }

    return data || []
  }

  /**
   * Mendapatkan quiz type berdasarkan code
   */
  async getQuizTypeByCode(code: string): Promise<QuizType | null> {
    const { data, error } = await this.supabase
      .from('quiz_types')
      .select('*')
      .eq('code', code)
      .single()

    if (error) {
      console.error('Error fetching quiz type:', error)
      return null
    }

    return data
  }

  /**
   * Membuat attempt baru (saat quiz dimulai)
   */
  async createQuizAttempt(quizTypeCode: string, totalQuestions: number): Promise<string | null> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const quizType = await this.getQuizTypeByCode(quizTypeCode)
    if (!quizType) throw new Error('Quiz type not found')

    const { data, error } = await this.supabase
      .from('quiz_attempts')
      .insert({
        user_id: user.id,
        quiz_type_id: quizType.id,
        score: 0,
        max_possible_score: quizType.max_score,
        correct_answers: 0,
        total_questions: totalQuestions,
        detailed_results: null
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating quiz attempt:', error)
      throw new Error('Failed to create quiz attempt')
    }

    return data.id
  }

  /**
   * Menyelesaikan quiz dan menyimpan hasil
   */
  async completeQuizAttempt(
    attemptId: string,
    correctAnswers: number,
    totalQuestions: number,
    timeSpentSeconds: number,
    detailedResults: QuizDetailedResults
  ): Promise<QuizAttempt | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) {
        console.error('User not authenticated')
        throw new Error('User not authenticated')
      }

      console.log('🔄 Starting quiz completion process...')
      console.log('📝 Attempt details:', { 
        attemptId, 
        correctAnswers, 
        totalQuestions, 
        timeSpentSeconds,
        userId: user.id 
      })

      // Get the attempt to get max_possible_score
      console.log('🔍 Fetching quiz attempt from database...')
      const { data: attempt, error: fetchError } = await this.supabase
        .from('quiz_attempts')
        .select('*, quiz_types(*)')
        .eq('id', attemptId)
        .eq('user_id', user.id)
        .single()

      if (fetchError) {
        console.error('❌ Error fetching quiz attempt:', fetchError)
        console.error('❌ Fetch error details:', {
          message: fetchError.message,
          code: fetchError.code,
          details: fetchError.details,
          hint: fetchError.hint
        })
        throw new Error(`Failed to fetch quiz attempt: ${fetchError.message}`)
      }

      if (!attempt) {
        console.error('❌ Quiz attempt not found for ID:', attemptId)
        throw new Error('Quiz attempt not found')
      }

      console.log('✅ Found attempt:', {
        id: attempt.id,
        quiz_type: attempt.quiz_types?.name,
        max_score: attempt.quiz_types?.max_score,
        current_score: attempt.score
      })

      // Validate quiz_types data
      if (!attempt.quiz_types) {
        console.error('❌ Quiz type data not found in attempt')
        throw new Error('Quiz type data not found')
      }

      const maxScore = attempt.quiz_types.max_score || 100 // fallback
      const score = Math.round((correctAnswers / totalQuestions) * maxScore)
      const percentage = calculatePercentage(score, maxScore)
      const grade = calculateGrade(percentage)

      console.log('📊 Calculated scores:', { 
        maxScore,
        score, 
        percentage, 
        grade: grade.grade,
        gradeDetails: grade
      })

      // Prepare update data with type safety (percentage is auto-calculated by DB)
      const updateData = {
        score: Number(score),
        correct_answers: Number(correctAnswers),
        grade: grade.grade,
        time_taken_seconds: Number(timeSpentSeconds),
        detailed_results: detailedResults,
        completed_at: new Date().toISOString()
      }

      console.log('📤 Preparing to update with data:', updateData)

      // Validate data before update
      if (isNaN(updateData.score!) || isNaN(updateData.correct_answers!) || isNaN(updateData.time_taken_seconds!)) {
        console.error('❌ Invalid numeric data detected:', {
          score: updateData.score,
          correct_answers: updateData.correct_answers,
          time_taken_seconds: updateData.time_taken_seconds
        })
        throw new Error('Invalid numeric data for quiz update')
      }

      console.log('💾 Updating quiz attempt in database...')
      const { data, error } = await this.supabase
        .from('quiz_attempts')
        .update(updateData)
        .eq('id', attemptId)
        .eq('user_id', user.id)
        .select('*')
        .single()

      if (error) {
        console.error('❌ Error updating quiz attempt:', error)
        console.error('❌ Update error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        throw new Error(`Failed to complete quiz attempt: ${error.message}`)
      }

      if (!data) {
        console.error('❌ No data returned from update operation')
        throw new Error('Update operation returned no data')
      }

      console.log('✅ Quiz attempt completed successfully:', {
        id: data.id,
        score: data.score,
        percentage: data.percentage,
        grade: data.grade
      })

      // Update topic progress
      try {
        console.log('🔄 Updating topic progress...')
        // Map quiz type code to topic code for consistency
        const topicCode = attempt.quiz_types.code.toLowerCase()
        await this.updateTopicProgress(topicCode, percentage)
        console.log('✅ Topic progress updated successfully')
      } catch (topicError) {
        console.warn('⚠️ Failed to update topic progress:', topicError)
        // Don't throw here, main quiz completion succeeded
      }

      return data
    } catch (error) {
      console.error('💥 Complete quiz attempt error:', error)
      if (error instanceof Error) {
        console.error('💥 Error message:', error.message)
        console.error('💥 Error stack:', error.stack)
      }
      throw error
    }
  }

  /**
   * Mendapatkan semua attempts user
   */
  async getUserQuizAttempts(limit?: number): Promise<QuizAttempt[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    let query = this.supabase
      .from('quiz_attempts')
      .select(`
        *,
        quiz_types (
          name,
          code,
          difficulty_level
        )
      `)
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching user quiz attempts:', error)
      throw new Error('Failed to fetch quiz attempts')
    }

    return data || []
  }

  /**
   * Mendapatkan attempts untuk quiz type tertentu
   */
  async getQuizTypeAttempts(quizTypeCode: string): Promise<QuizAttempt[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await this.supabase
      .from('quiz_attempts')
      .select(`
        *,
        quiz_types!inner (
          name,
          code,
          difficulty_level
        )
      `)
      .eq('user_id', user.id)
      .eq('quiz_types.code', quizTypeCode)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })

    if (error) {
      console.error('Error fetching quiz type attempts:', error)
      throw new Error('Failed to fetch quiz type attempts')
    }

    return data || []
  }

  /**
   * Mendapatkan statistik pembelajaran user
   */
  async getUserLearningStats(): Promise<UserLearningStats | null> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await this.supabase
      .from('user_learning_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user learning stats:', error)
      throw new Error('Failed to fetch learning stats')
    }

    return data
  }

  /**
   * Update progress topik
   */
  async updateTopicProgress(topicCode: string, newScore: number): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) {
        console.error('❌ User not authenticated for topic progress update')
        throw new Error('User not authenticated')
      }

      console.log('🔍 Checking existing topic progress:', { topicCode, newScore, userId: user.id })

      // Get existing progress - use maybeSingle() to avoid 406 error when no data exists
      const { data: existingProgress, error: fetchError } = await this.supabase
        .from('topic_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('topic_code', topicCode)
        .maybeSingle()

      if (fetchError) {
        console.error('❌ Error fetching topic progress:', fetchError)
        throw new Error(`Failed to fetch topic progress: ${fetchError.message}`)
      }

      const now = new Date().toISOString()

      if (existingProgress) {
        console.log('📊 Updating existing topic progress:', existingProgress)
        
        // Update existing progress
        const newAttemptCount = existingProgress.attempts_count + 1
        const newBestScore = Math.max(existingProgress.best_score || 0, newScore)
        
        // Calculate mastery percentage (weighted average with emphasis on recent performance)
        const masteryPercentage = Math.min(100, (newBestScore * 0.7) + (newScore * 0.3))

        const { error: updateError } = await this.supabase
          .from('topic_progress')
          .update({
            mastery_percentage: masteryPercentage,
            attempts_count: newAttemptCount,
            best_score: newBestScore,
            last_attempt_at: now,
            updated_at: now
          })
          .eq('user_id', user.id)
          .eq('topic_code', topicCode)

        if (updateError) {
          console.error('❌ Error updating topic progress:', updateError)
          throw new Error(`Failed to update topic progress: ${updateError.message}`)
        }

        console.log('✅ Topic progress updated:', {
          topicCode,
          masteryPercentage,
          newAttemptCount,
          newBestScore
        })
      } else {
        console.log('📝 Creating new topic progress record')
        
        // Create new progress record
        const { error: insertError } = await this.supabase
          .from('topic_progress')
          .insert({
            user_id: user.id,
            topic_code: topicCode,
            mastery_percentage: newScore,
            attempts_count: 1,
            best_score: newScore,
            last_attempt_at: now
          })

        if (insertError) {
          console.error('❌ Error creating topic progress:', insertError)
          throw new Error(`Failed to create topic progress: ${insertError.message}`)
        }

        console.log('✅ New topic progress created:', {
          topicCode,
          masteryPercentage: newScore,
          attempts_count: 1,
          best_score: newScore
        })
      }
    } catch (error) {
      console.error('💥 Topic progress update error:', error)
      throw error
    }
  }

  /**
   * Mendapatkan progress semua topik user
   */
  async getUserTopicProgress(): Promise<TopicProgress[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await this.supabase
      .from('topic_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('last_attempt_at', { ascending: false })

    if (error) {
      console.error('Error fetching topic progress:', error)
      throw new Error('Failed to fetch topic progress')
    }

    return data || []
  }

  /**
   * Mendapatkan leaderboard (opsional - untuk fitur sosial)
   */
  async getLeaderboard(limit: number = 10): Promise<Array<{
    user_id: string
    user_email: string
    average_score: number
    total_quizzes: number
    mastery_level: string
  }>> {
    const { data, error } = await this.supabase
      .from('user_learning_stats')
      .select(`
        user_id,
        average_score,
        total_quizzes_taken,
        mastery_level,
        profiles:user_id (
          email
        )
      `)
      .order('average_score', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }

    return data?.map(item => ({
      user_id: item.user_id,
      user_email: Array.isArray(item.profiles) && item.profiles.length > 0 
        ? item.profiles[0].email || 'Anonymous'
        : 'Anonymous',
      average_score: item.average_score,
      total_quizzes: item.total_quizzes_taken,
      mastery_level: item.mastery_level
    })) || []
  }

  /**
   * Reset progress user (untuk development/testing)
   */
  async resetUserProgress(): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Delete in correct order due to foreign key constraints
    await this.supabase.from('topic_progress').delete().eq('user_id', user.id)
    await this.supabase.from('quiz_attempts').delete().eq('user_id', user.id)
    await this.supabase.from('user_learning_stats').delete().eq('user_id', user.id)
  }
}

// Export singleton instance
export const academicScoringService = new AcademicScoringService()
