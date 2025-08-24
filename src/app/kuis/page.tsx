import { FeaturePageLayout } from '@/components/feature-page-layout'
import { QuizMain } from '@/components/quiz/quiz-main'
import { Brain } from 'lucide-react'

export default function ComprehensiveQuizPage() {
  return (
    <>
    <div>
      <FeaturePageLayout title='Kuis' icon={<Brain size={50} />} bgColor='bg-lightblue-card' backHref='/dashboard'>
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <QuizMain />
        </div>
      </FeaturePageLayout>
    </div>
    </>
  )
}