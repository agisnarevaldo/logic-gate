"use client"

import { FeaturePageLayout } from "@/components/feature-page-layout"
import { Brain } from "lucide-react"
import { ApplicationsQuiz } from "@/components/quiz/applications-quiz"

export default function ApplicationsQuizPage() {

  return (
    <>
      <div>
        <FeaturePageLayout title="Aplikasi Gerbang Logika" icon={<Brain size={50} />} bgColor="bg-lightblue-card" backHref="/kuis">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <ApplicationsQuiz />
          </div>
        </FeaturePageLayout>
      </div>
    </>
  )
}
