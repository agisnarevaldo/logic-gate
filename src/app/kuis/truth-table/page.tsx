"use client"

import { FeaturePageLayout } from "@/components/feature-page-layout"
import { Brain } from "lucide-react"
import { TruthTableQuiz } from "@/components/quiz/truth-table-quiz"

export default function TruthTableQuizPage() {
  return (
    <>
      <div>
        <FeaturePageLayout title="Tabel Kebenaran" icon={<Brain size={50} />} bgColor="bg-lightblue-card" backHref="/kuis">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <TruthTableQuiz />
          </div>
        </FeaturePageLayout>
      </div>
    </>
  )
}
