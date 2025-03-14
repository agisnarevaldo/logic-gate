"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { ChecklistIcon } from "@/components/icon"

export default function TujuanBelajarPage() {
    const [showLoading, setShowLoading] = useState(true)

    const objectives = [
        {
            id: 1,
            title: "Objective 1",
            description: "Understand the basic concepts of logic gates and their functions in digital circuits.",
        },
        {
            id: 2,
            title: "Objective 2",
            description: "Learn how to identify and use different types of logic gates in circuit design.",
        },
    ]

    return (
        <>
            <AnimatePresence mode="wait">
                {showLoading && (
                    <PageLoadingScreen
                        bgColor="bg-yellow-card"
                        icon={<ChecklistIcon />}
                        text="Tujuan Belajar"
                        onComplete={() => setShowLoading(false)}
                    />
                )}
            </AnimatePresence>

            <div className={showLoading ? "hidden" : ""}>
                <FeaturePageLayout title="T. Belajar" icon={<ChecklistIcon />} bgColor="bg-yellow-card">
                    {objectives.map((objective) => (
                        <div key={objective.id} className="bg-yellow-card rounded-2xl p-6 mb-6 text-white">
                            <h3 className="text-xl font-bold mb-2">{objective.title}</h3>
                            <p>{objective.description}</p>
                        </div>
                    ))}
                </FeaturePageLayout>
            </div>
        </>
    )
}
