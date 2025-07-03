"use client"

import { FeaturePageLayout } from "@/components/feature-page-layout"
import { Brain } from "lucide-react"
import { AdvancedGatesQuiz } from "@/components/quiz/advanced-gates-quiz"

export default function AdvancedGatesQuizPage() {

  return (
    <>

      <div>
        <FeaturePageLayout title="Gerbang Logika Turunan" icon={<Brain size={50} />} bgColor="bg-lightblue-card" backHref="/kuis">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <AdvancedGatesQuiz />
          </div>
        </FeaturePageLayout>
      </div>
    </>
  )
}
