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
        { id: 1, title: "Matching", href: "/game/matching", description: "Cocokkan gambar gerbang logika dengan nama yang tepat" },
        { id: 2, title: "Logic Challenge", href: "/game/challenge", description: "Tantangan membangun rangkaian logika yang tepat" },
        { id: 3, title: "Tebak Gambar", href: "/game/guess", description: "Tebak aplikasi gerbang logika dalam kehidupan sehari-hari" },
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
                        <Link key={game.id} href={game.href} className="block bg-magenta-card rounded-2xl p-6 mb-6 transition-transform hover:scale-105">
                            <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                            <p className="text-white/80">{game.description}</p>
                        </Link>
                    ))}
                </FeaturePageLayout>
            </div>
        </>
    )
}
