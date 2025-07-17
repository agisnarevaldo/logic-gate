import { createClient } from '@/lib/supabase/client'
import { 
  UserProgress, 
  LearningMaterial, 
  QuizConfig,
  Achievement,
  UserAchievement,
  MaterialState,
  QuizState,
  ProgressionState,
  ProgressionUpdate
} from '@/types/progression'

class ProgressionService {
  private supabase = createClient()

  /**
   * Get or create user progress
   */
  async getUserProgress(): Promise<UserProgress | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) {
        console.error('User not authenticated')
        throw new Error('User not authenticated')
      }

      console.log('Fetching user progress for user:', user.id)

      const { data, error } = await this.supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // User progress doesn't exist, create it
        console.log('User progress not found, creating new progress for user:', user.id)
        
        const { data: newProgress, error: createError } = await this.supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            material_level: 1,
            quiz_level: 0,
            completed_materials: [],
            passed_quizzes: [],
            total_xp: 0,
            streak_days: 0,
            last_activity: new Date().toISOString().split('T')[0]
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating user progress:', createError)
          console.error('Error details:', JSON.stringify(createError, null, 2))
          throw new Error(`Failed to create user progress: ${createError.message || 'Unknown error'}`)
        }
        
        console.log('Successfully created user progress:', newProgress)
        return newProgress
      }

      if (error) {
        console.error('Error fetching user progress:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        throw new Error(`Failed to fetch user progress: ${error.message || 'Unknown error'}`)
      }

      console.log('Successfully fetched user progress:', data)
      return data
      
    } catch (error) {
      console.error('getUserProgress failed:', error)
      throw error
    }
  }

  /**
   * Get all learning materials with order
   */
  async getLearningMaterials(): Promise<LearningMaterial[]> {
    try {
      console.log('Fetching learning materials...')
      
      const { data, error } = await this.supabase
        .from('learning_materials')
        .select('*')
        .eq('is_active', true)
        .order('level', { ascending: true })

      if (error) {
        console.error('Error fetching learning materials:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        throw new Error(`Failed to fetch learning materials: ${error.message}`)
      }

      console.log('Learning materials fetched:', data?.length || 0, 'items')
      return data || []
      
    } catch (error) {
      console.error('getLearningMaterials failed:', error)
      throw error
    }
  }

  /**
   * Get all quiz configurations
   */
  async getQuizConfigs(): Promise<QuizConfig[]> {
    try {
      console.log('Fetching quiz configs...')
      
      const { data, error } = await this.supabase
        .from('quiz_config')
        .select('*')
        .eq('is_active', true)
        .order('level', { ascending: true })

      if (error) {
        console.error('Error fetching quiz configs:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        throw new Error(`Failed to fetch quiz configs: ${error.message}`)
      }

      console.log('Quiz configs fetched:', data?.length || 0, 'items')
      return data || []
      
    } catch (error) {
      console.error('getQuizConfigs failed:', error)
      throw error
    }
  }

  /**
   * Get progression state for user (materials + quizzes with lock status)
   */
  async getProgressionState(): Promise<ProgressionState | null> {
    try {
      console.log('Getting progression state...')
      
      // Fetch user progress first - this is the most important
      const userProgress = await this.getUserProgress()
      
      if (!userProgress) {
        console.warn('No user progress found - cannot create progression state')
        return null
      }

      // Fetch materials and quizzes in parallel
      const [materials, quizzes] = await Promise.all([
        this.getLearningMaterials().catch(err => {
          console.warn('Failed to fetch materials, using empty array:', err)
          return []
        }),
        this.getQuizConfigs().catch(err => {
          console.warn('Failed to fetch quizzes, using empty array:', err)
          return []
        })
      ])

      console.log('Fetched data:', { userProgress: !!userProgress, materials: materials.length, quizzes: quizzes.length })

      // Map materials with their states
      const materialStates: MaterialState[] = materials.map(material => ({
        material,
        status: this.getMaterialStatus(material, userProgress)
      }))

      // Map quizzes with their states  
      const quizStates: QuizState[] = quizzes.map(quiz => ({
        quiz,
        status: this.getQuizStatus(quiz, userProgress),
        unlock_reason: this.getQuizUnlockReason(quiz, userProgress)
      }))

      // Get recent achievements with fallback
      const recentAchievements = await this.getRecentAchievements().catch(err => {
        console.warn('Failed to fetch achievements:', err)
        return []
      })

      const result = {
        userProgress,
        materials: materialStates,
        quizzes: quizStates,
        recentAchievements,
        canProceedToNext: this.canProceedToNext(userProgress, materials, quizzes)
      }

      console.log('Progression state created successfully:', { 
        materialsCount: result.materials.length, 
        quizzesCount: result.quizzes.length,
        achievementsCount: result.recentAchievements.length
      })
      return result
      
    } catch (error) {
      console.error('Error getting progression state:', error)
      return null
    }
  }

  /**
   * Determine material status based on user progress
   */
  private getMaterialStatus(material: LearningMaterial, userProgress: UserProgress): 'locked' | 'available' | 'completed' {
    // Check if completed
    if (userProgress.completed_materials.includes(material.level)) {
      return 'completed'
    }

    // Check if available (prerequisite met)
    if (material.prerequisite_level && !userProgress.completed_materials.includes(material.prerequisite_level)) {
      return 'locked'
    }

    // Check if within unlocked level
    if (material.level <= userProgress.material_level) {
      return 'available'
    }

    return 'locked'
  }

  /**
   * Determine quiz status based on user progress
   */
  private getQuizStatus(quiz: QuizConfig, userProgress: UserProgress): 'locked' | 'available' | 'passed' | 'failed' {
    // Check if passed
    if (userProgress.passed_quizzes.includes(quiz.quiz_code)) {
      return 'passed'
    }

    // Check material prerequisite
    if (!userProgress.completed_materials.includes(quiz.unlock_material_level)) {
      return 'locked'
    }

    // Check quiz prerequisite
    if (quiz.prerequisite_quiz && !userProgress.passed_quizzes.includes(quiz.prerequisite_quiz)) {
      return 'locked'
    }

    return 'available'
  }

  /**
   * Get reason why quiz is locked
   */
  private getQuizUnlockReason(quiz: QuizConfig, userProgress: UserProgress): string | undefined {
    if (userProgress.passed_quizzes.includes(quiz.quiz_code)) {
      return undefined
    }

    if (!userProgress.completed_materials.includes(quiz.unlock_material_level)) {
      return `Selesaikan materi level ${quiz.unlock_material_level} terlebih dahulu`
    }

    if (quiz.prerequisite_quiz && !userProgress.passed_quizzes.includes(quiz.prerequisite_quiz)) {
      return `Lulus quiz ${quiz.prerequisite_quiz} terlebih dahulu`
    }

    return undefined
  }

  /**
   * Check if user can proceed to next level
   */
  private canProceedToNext(userProgress: UserProgress, materials: LearningMaterial[], quizzes: QuizConfig[]): boolean {
    const currentMaterialLevel = userProgress.material_level
    const currentQuizLevel = userProgress.quiz_level

    // Check if current material level is completed
    const isCurrentMaterialCompleted = userProgress.completed_materials.includes(currentMaterialLevel)
    
    // Check if there's a quiz for current level and it's passed
    const currentLevelQuiz = quizzes.find(q => q.level === currentQuizLevel + 1)
    const isCurrentQuizPassed = currentLevelQuiz ? 
      userProgress.passed_quizzes.includes(currentLevelQuiz.quiz_code) : true

    return isCurrentMaterialCompleted && isCurrentQuizPassed
  }

  /**
   * Update user progress after activity
   */
  async updateProgress(update: ProgressionUpdate): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    try {
      const { error } = await this.supabase.rpc('update_user_progress', {
        p_user_id: user.id,
        p_activity_type: update.activity_type,
        p_reference_id: update.reference_id,
        p_xp_earned: update.xp_earned,
        p_material_level: update.material_level,
        p_quiz_level: update.quiz_level,
        p_completed_material: update.completed_material,
        p_passed_quiz: update.passed_quiz
      })

      if (error) {
        console.error('Error updating progress:', error)
        return false
      }

      // Check for new achievements
      await this.checkAndAwardAchievements()

      return true
    } catch (error) {
      console.error('Error updating progress:', error)
      return false
    }
  }

  /**
   * Mark material as completed
   */
  async completeMaterial(materialSlug: string): Promise<boolean> {
    const materials = await this.getLearningMaterials()
    const material = materials.find(m => m.slug === materialSlug)
    
    if (!material) {
      console.error('Material not found:', materialSlug)
      return false
    }

    const userProgress = await this.getUserProgress()
    if (!userProgress) return false

    // Calculate next material level
    const nextMaterialLevel = Math.max(userProgress.material_level, material.level + 1)

    return await this.updateProgress({
      activity_type: 'material_read',
      reference_id: materialSlug,
      xp_earned: material.xp_reward,
      material_level: nextMaterialLevel,
      completed_material: material.level
    })
  }

  /**
   * Mark quiz as completed/passed
   */
  async completeQuiz(quizCode: string, score: number, percentage: number): Promise<boolean> {
    const quizzes = await this.getQuizConfigs()
    const quiz = quizzes.find(q => q.quiz_code === quizCode)
    
    if (!quiz) {
      console.error('Quiz config not found:', quizCode)
      return false
    }

    const isPerfect = percentage >= 95
    const isPassed = percentage >= quiz.passing_score

    if (!isPassed) {
      // Just log the attempt, don't update progression
      return await this.updateProgress({
        activity_type: 'quiz_completed',
        reference_id: quizCode,
        xp_earned: 0 // No XP for failed quiz
      })
    }

    const userProgress = await this.getUserProgress()
    if (!userProgress) return false

    // Calculate XP reward
    const xpReward = isPerfect ? quiz.xp_reward_perfect : quiz.xp_reward_pass

    // Calculate next quiz level
    const nextQuizLevel = Math.max(userProgress.quiz_level, quiz.level)

    return await this.updateProgress({
      activity_type: isPerfect ? 'quiz_perfect' : 'quiz_completed',
      reference_id: quizCode,
      xp_earned: xpReward,
      quiz_level: nextQuizLevel,
      passed_quiz: quizCode,
      score
    })
  }

  /**
   * Get recent achievements
   */
  async getRecentAchievements(limit: number = 5): Promise<UserAchievement[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await this.supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching achievements:', error)
      return []
    }

    return data || []
  }

  /**
   * Check and award new achievements
   */
  private async checkAndAwardAchievements(): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) return

    const userProgress = await this.getUserProgress()
    if (!userProgress) return

    // Get all achievements user hasn't earned yet
    const { data: availableAchievements } = await this.supabase
      .from('achievements')
      .select(`
        *,
        user_achievements!left(user_id)
      `)
      .eq('is_active', true)
      .is('user_achievements.user_id', null)

    if (!availableAchievements) return

    // Check each achievement
    for (const achievement of availableAchievements) {
      const shouldAward = this.checkAchievementRequirement(achievement, userProgress)
      
      if (shouldAward) {
        await this.awardAchievement(user.id, achievement.id)
      }
    }
  }

  /**
   * Check if achievement requirement is met
   */
  private checkAchievementRequirement(achievement: Achievement, userProgress: UserProgress): boolean {
    switch (achievement.requirement_type) {
      case 'completion':
        return userProgress.completed_materials.length >= achievement.requirement_value
      case 'xp':
        return userProgress.total_xp >= achievement.requirement_value
      case 'streak':
        return userProgress.streak_days >= achievement.requirement_value
      case 'perfect_score':
        // This would need to check quiz attempts - simplified for now
        return userProgress.passed_quizzes.length >= achievement.requirement_value
      default:
        return false
    }
  }

  /**
   * Award achievement to user
   */
  private async awardAchievement(userId: string, achievementId: number): Promise<void> {
    const { error } = await this.supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId
      })

    if (error) {
      console.error('Error awarding achievement:', error)
    }
  }
}

export const progressionService = new ProgressionService()
