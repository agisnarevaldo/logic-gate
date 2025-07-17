import { createClient } from '@/lib/supabase/client'

export async function debugAcademicSystem() {
  const supabase = createClient()
  
  console.log('🔧 Debug Academic System Starting...')
  
  try {
    // Test 1: Check authentication
    console.log('\n1️⃣ Testing Authentication...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('❌ Auth Error:', authError)
      return
    }
    
    if (!user) {
      console.log('⚠️ No authenticated user')
      return
    }
    
    console.log('✅ User authenticated:', user.id)
    
    // Test 2: Check quiz_types table
    console.log('\n2️⃣ Testing Quiz Types...')
    const { data: quizTypes, error: qtError } = await supabase
      .from('quiz_types')
      .select('*')
      .limit(5)
    
    if (qtError) {
      console.error('❌ Quiz Types Error:', qtError)
    } else {
      console.log('✅ Quiz Types found:', quizTypes?.length)
      console.log('📋 Available quiz types:', quizTypes?.map(qt => qt.code))
    }
    
    // Test 3: Check quiz_attempts table access
    console.log('\n3️⃣ Testing Quiz Attempts...')
    const { data: attempts, error: qaError } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .limit(5)
    
    if (qaError) {
      console.error('❌ Quiz Attempts Error:', qaError)
    } else {
      console.log('✅ Quiz Attempts accessible, found:', attempts?.length)
    }
    
    // Test 4: Check user_learning_stats table
    console.log('\n4️⃣ Testing User Learning Stats...')
    const { data: stats, error: statsError } = await supabase
      .from('user_learning_stats')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
    
    if (statsError) {
      console.error('❌ User Learning Stats Error:', statsError)
    } else {
      console.log('✅ User Learning Stats accessible, found:', stats?.length)
    }
    
    // Test 5: Try creating a test quiz attempt
    console.log('\n5️⃣ Testing Quiz Attempt Creation...')
    const testQuizType = quizTypes?.[0]
    
    if (testQuizType) {
      const { data: newAttempt, error: createError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_type_id: testQuizType.id,
          score: 0,
          max_possible_score: testQuizType.max_score,
          correct_answers: 0,
          total_questions: 5,
          detailed_results: null
        })
        .select('id')
        .single()
      
      if (createError) {
        console.error('❌ Create Attempt Error:', createError)
      } else {
        console.log('✅ Test attempt created:', newAttempt?.id)
        
        // Test 6: Try updating the attempt
        console.log('\n6️⃣ Testing Quiz Attempt Update...')
        const { data: updatedAttempt, error: updateError } = await supabase
          .from('quiz_attempts')
          .update({
            score: 80,
            correct_answers: 4,
            grade: 'B+',
            time_taken_seconds: 120,
            completed_at: new Date().toISOString()
          })
          .eq('id', newAttempt.id)
          .eq('user_id', user.id)
          .select('*')
          .single()
        
        if (updateError) {
          console.error('❌ Update Attempt Error:', updateError)
        } else {
          console.log('✅ Test attempt updated successfully')
          console.log('📊 Updated data:', {
            score: updatedAttempt.score,
            percentage: updatedAttempt.percentage,
            grade: updatedAttempt.grade
          })
        }
        
        // Cleanup: Delete test attempt
        await supabase
          .from('quiz_attempts')
          .delete()
          .eq('id', newAttempt.id)
        
        console.log('🧹 Test attempt cleaned up')
      }
    }
    
    console.log('\n✅ Debug complete!')
    
  } catch (error) {
    console.error('💥 Debug Error:', error)
  }
}

// For browser console testing
if (typeof window !== 'undefined') {
  (window as unknown as { debugAcademicSystem: typeof debugAcademicSystem }).debugAcademicSystem = debugAcademicSystem
}
