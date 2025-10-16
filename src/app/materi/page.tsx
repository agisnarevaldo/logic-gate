"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { BookIcon } from "@/components/icon"
import Link from "next/link"
import { learningMaterials } from "@/data/learning-materials"
import Image from "next/image"

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
                <FeaturePageLayout title="Materi" icon={<BookIcon />} bgColor="bg-orange-card" isDark={true}>
                    <div className="mb-8">
                        <h3 className="text-3xl font-bold mb-4 text-center text-white">Pilih Materi</h3>
                        <div className="h-px bg-gray-600 w-full mb-4" />

                        <div className="space-y-4">
                            {learningMaterials.map((category, index) => (
                                <Link key={category.id} href={`/materi/${category.slug}`} className="bg-orange-card flex gap-1 rounded-lg hover:scale-102 drop-shadow-lg shadow-lg">
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        width={120}
                                        height={100}
                                        className="rounded-lg bg-gray-200 border border-gray-200"
                                    />
                                    <div className="bg-orange-card text-white p-4 rounded-r-md hover:bg-orange-100 transition-colors">
                                        <h4 className="text-xl font-bold">{index + 1}. {category.title}</h4>
                                        {/* <p>{category.title}</p> */}
                                        <p className="text-sm text-neutral-200 mt-1">{category.description}</p>
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