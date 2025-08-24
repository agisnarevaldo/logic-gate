"use client"

import { FeaturePageLayout } from "@/components/feature-page-layout"
import { MatchingQuiz } from "@/components/quiz/matching-quiz"
import { GameControllerIcon } from "@/components/icon"

export default function MatchingQuizPage() {
  return (
    <>
      <div>
        <FeaturePageLayout title="Game" icon={<GameControllerIcon />} bgColor="bg-magenta-card" backHref="/game">
          <div className="bg-white rounded-lg shadow-md p-1 md:p-3">
            <MatchingQuiz />
          </div>
        </FeaturePageLayout>
      </div>
    </>
  )
}