"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { GameControllerIcon } from "@/components/icon"
import Link from "next/link"

export default function GamePage() {
    const [showLoading, setShowLoading] = useState(true)

    const games = [
        { id: 1, title: "Matching", href: "/game/matching" },
        { id: 2, title: "Logic Challenge", href: "/game/challenge" },
    ]

    return (
        <>
            <AnimatePresence mode="wait">
                {showLoading && (
                    <PageLoadingScreen
                        bgColor="bg-magenta-card"
                        icon={<GameControllerIcon />}
                        text="Game"
                        onComplete={() => setShowLoading(false)}
                    />
                )}
            </AnimatePresence>

            <div className={showLoading ? "hidden" : ""}>
                <FeaturePageLayout title="Game" icon={<GameControllerIcon />} bgColor="bg-magenta-card">
                    {games.map((game) => (
                        <Link key={game.id} href={game.href} className="block bg-magenta-card rounded-2xl p-6 mb-6">
                            <h3 className="text-xl font-bold text-white">{game.title}</h3>
                            <p className="text-white/80">Play and learn about logic gates</p>
                        </Link>
                    ))}
                </FeaturePageLayout>
            </div>
        </>
    )
}
