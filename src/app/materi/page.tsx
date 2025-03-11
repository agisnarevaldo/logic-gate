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
                    <div className="grid grid-cols-2 gap-4">
                        {materials.map((material) => (
                            <Link
                                key={material.id}
                                href={material.href}
                                className="bg-orange-card rounded-2xl p-6 flex items-center justify-center text-center"
                            >
                                <h3 className="text-xl font-bold text-white">{material.title}</h3>
                            </Link>
                        ))}
                    </div>
                </FeaturePageLayout>
            </div>
        </>
    )
}

