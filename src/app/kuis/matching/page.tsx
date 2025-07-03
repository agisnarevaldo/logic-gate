"use client"

import { FeaturePageLayout } from "@/components/feature-page-layout"
import { Brain } from "lucide-react"
import { MatchingQuiz } from "@/components/quiz/matching-quiz"

export default function MatchingQuizPage() {
  return (
    <>
      <div>
        <FeaturePageLayout title="Matching Quiz" icon={<Brain size={50} />} bgColor="bg-lightblue-card" backHref="/kuis">
          <div className="bg-white rounded-lg shadow-md p-1 md:p-3">
            <MatchingQuiz />
          </div>
        </FeaturePageLayout>
      </div>
    </>
  )
}