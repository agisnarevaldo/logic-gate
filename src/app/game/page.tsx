"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { GameControllerIcon } from "@/components/icon"
import Link from "next/link"
import Image from "next/image"

export default function GamePage() {
    const [showLoading, setShowLoading] = useState(true)

    const games = [
        { id: 1, title: "Matching", href: "/game/matching", description: "Cocokkan gambar gerbang logika dengan nama yang tepat", image: "/vectors/game2.svg" },
        { id: 2, title: "Logic Challenge", href: "/game/challenge", description: "Tantangan membangun rangkaian logika yang tepat", image: "/vectors/game1.svg" },
        { id: 3, title: "Tebak Gambar", href: "/game/guess", description: "Tebak aplikasi gerbang logika dalam kehidupan sehari-hari", image: "/vectors/game3.svg" },
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
                    <h3 className="text-3xl font-bold mb-4 text-center text-black">Pilih Game</h3>
                    <div className="h-px bg-gray-200 w-full mb-4" />
                    {games.map((game) => (
                        <Link
                            key={game.id}
                            href={game.href}
                            className="flex gap-1 bg-magenta-card rounded-2xl mb-4 transition-transform hover:scale-102 drop-shadow-lg shadow-lg"
                        >
                            <Image
                                src={game.image}
                                alt={game.title}
                                width={120}
                                height={100}
                                className="rounded-lg bg-gray-100 border border-gray-100"
                            />
                            <div className="bg-magenta-card text-white p-4 rounded-r-md transition-colors">
                                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                                <p className="text-white/80">{game.description}</p>
                            </div>
                        </Link>
                    ))}
                </FeaturePageLayout>
            </div>
        </>
    )
}
