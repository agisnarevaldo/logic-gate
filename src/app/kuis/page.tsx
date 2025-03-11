"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { BrainIcon } from "@/components/icon"
import Link from "next/link"

export default function KuisPage() {
    const [showLoading, setShowLoading] = useState(true)

    const quizzes = [
        { id: 1, title: "Basic Logic Gates", href: "/kuis/basic" },
        { id: 2, title: "Combination Logic", href: "/kuis/combination" },
        { id: 3, title: "Advanced Circuits", href: "/kuis/advanced" },
    ]

    return (
        <>
            <AnimatePresence mode="wait">
                {showLoading && (
                    <PageLoadingScreen
                        bgColor="bg-lightblue-card"
                        icon={<BrainIcon />}
                        text="Kuis"
                        onComplete={() => setShowLoading(false)}
                    />
                )}
            </AnimatePresence>

            <div className={showLoading ? "hidden" : ""}>
                <FeaturePageLayout title="Kuis" icon={<BrainIcon />} bgColor="bg-lightblue-card">
                    {quizzes.map((quiz) => (
                        <Link key={quiz.id} href={quiz.href} className="block bg-lightblue-card rounded-2xl p-6 mb-6">
                            <h3 className="text-xl font-bold text-white">{quiz.title}</h3>
                            <p className="text-white/80">Test your knowledge</p>
                        </Link>
                    ))}
                </FeaturePageLayout>
            </div>
        </>
    )
}
