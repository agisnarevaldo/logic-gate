"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { BookIcon } from "@/components/icon"
import Link from "next/link"

export default function MateriPage() {
    const [showLoading, setShowLoading] = useState(true)

    const materials = [
        { id: 1, title: "Pengantar", href: "/materi/pengantar" },
        { id: 2, title: "Gerbang Logika Dasar", href: "/materi/gerbang-dasar" },
        { id: 3, title: "Gerbang Logika Kombinasi", href: "/materi/gerbang-kombinasi" },
        { id: 4, title: "Gerbang Logika Eklusif", href: "/materi/gerbang-eklusif" },
    ]

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
                            {materials.map((material, index) => (
                                <Link key={material.id} href={material.href} className="block">
                                    <div className="bg-orange-card text-white p-4 rounded-lg">
                                        <h4 className="text-xl font-bold">Materi {index + 1}</h4>
                                        <p>{material.title}</p>
                                    </div>
                                </Link>
                            ))}

                            {/* Additional materials to match the design */}
                            <Link href="#" className="block">
                                <div className="bg-orange-card text-white p-4 rounded-lg">
                                    <h4 className="text-xl font-bold">Materi 5</h4>
                                    <p>Additional Material</p>
                                </div>
                            </Link>

                            <Link href="#" className="block">
                                <div className="bg-orange-card text-white p-4 rounded-lg">
                                    <h4 className="text-xl font-bold">Materi 6</h4>
                                    <p>Additional Material</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </FeaturePageLayout>
            </div>
        </>
    )
}
