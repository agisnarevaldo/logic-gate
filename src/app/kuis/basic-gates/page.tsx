"use client"

import { FeaturePageLayout } from "@/components/feature-page-layout"
import { Brain } from "lucide-react"
import { BasicGatesQuiz } from "@/components/quiz/basic-gates-quiz"

export default function BasicGatesQuizPage() {
  return (
    <>
      <div>
        <FeaturePageLayout title="Gerbang Logika Dasar" icon={<Brain size={50} />} bgColor="bg-lightblue-card" backHref="/kuis">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <BasicGatesQuiz />
          </div>
        </FeaturePageLayout>
      </div>
    </>
  )
}
