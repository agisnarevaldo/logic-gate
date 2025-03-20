"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { BookIcon } from "@/components/icon"
import Link from "next/link"
import { learningMaterials } from "@/data/learning-materials"

export default function MateriPage() {
    const [showLoading, setShowLoading] = useState(true)

    return (
        <>
            <AnimatePresence mode="wait">
                {showLoading && (
                    <PageLoadingScreen
                        bgColor="bg-orange-card"
                        icon={<BookIcon />}
                        text="Materi"
                        onComplete={() => setShowLoading(false)}
                    />
                )}
            </AnimatePresence>

            <div className={showLoading ? "hidden" : ""}>
                <FeaturePageLayout title="Materi" icon={<BookIcon />} bgColor="bg-orange-card">
                    <div className="mb-8">
                        <h3 className="text-3xl font-bold mb-4 text-center">Pilih Materi</h3>
                        <div className="h-px bg-gray-300 w-full mb-4" />

                        <div className="space-y-4">
                            {learningMaterials.map((category, index) => (
                                <Link key={category.id} href={`/materi/${category.slug}`} className="block">
                                    <div className="bg-orange-card text-white p-4 rounded-lg">
                                        <h4 className="text-xl font-bold">Materi {index + 1}</h4>
                                        <p>{category.title}</p>
                                        <p className="text-sm text-white/80 mt-1">{category.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </FeaturePageLayout>
            </div>
        </>
    )
}