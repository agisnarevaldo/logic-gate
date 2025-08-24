"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { ChallengeGame } from "@/components/challenge/challenge-game"
import { GameControllerIcon } from "@/components/icon"
import { FeaturePageLayout } from "@/components/feature-page-layout"

export default function ChallengePage() {
    const [showLoading, setShowLoading] = useState(true)

    return (
        <>
            <div>
                <FeaturePageLayout title="Logic Challenge" icon={<GameControllerIcon />} bgColor="bg-magenta-card" backHref="/game">
                    <AnimatePresence mode="wait">
                        {showLoading && (
                            <PageLoadingScreen
                                bgColor="bg-magenta-card"
                                icon={<GameControllerIcon />}
                                text="Logic Challenge"
                                onComplete={() => setShowLoading(false)}
                            />
                        )}
                    </AnimatePresence>

                    <div className={showLoading ? "hidden" : ""}>
                        <ChallengeGame />
                    </div>
                </FeaturePageLayout>
            </div>

        </>
    )
}
