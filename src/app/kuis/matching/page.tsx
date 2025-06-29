"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { Brain } from "lucide-react"
import { MatchingQuiz } from "@/components/quiz/matching-quiz"

export default function MatchingQuizPage() {
  const [showLoading, setShowLoading] = useState(true)

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoading && (
          <PageLoadingScreen
            bgColor="bg-lightblue-card"
            icon={<Brain size={60} />}
            text="Logic Gate Matching Quiz"
            onComplete={() => setShowLoading(false)}
          />
        )}
      </AnimatePresence>

      <div className={showLoading ? "hidden" : ""}>
        <FeaturePageLayout title="Matching Quiz" icon={<Brain size={60} />} bgColor="bg-lightblue-card">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <MatchingQuiz />
          </div>
        </FeaturePageLayout>
      </div>
    </>
  )
}