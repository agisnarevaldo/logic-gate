"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { ChevronLeft, Menu } from "lucide-react"

interface FeaturePageLayoutProps {
    title: string
    icon: React.ReactNode
    bgColor: string
    children: React.ReactNode
}

export function FeaturePageLayout({ title, icon, bgColor, children }: FeaturePageLayoutProps) {
    const router = useRouter()

    return (
        <div className="min-h-screen max-w-md mx-auto flex flex-col">
            {/* Header */}
            <div className={`${bgColor} p-4 rounded-b-3xl`}>
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => router.push("/dashboard")} className="text-white p-2">
                        <ChevronLeft size={28} />
                    </button>
                    <button className="text-white p-2">
                        <Menu size={28} />
                    </button>
                </div>
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-16 h-16 text-white">{icon}</div>
                    <h1 className="text-white text-5xl font-bold">{title}</h1>
                </div>
            </div>

            {/* Title */}
            <div className="text-center my-8">
                <h2 className="text-4xl font-bold">Learn Logic</h2>
                <h2 className="text-4xl font-bold">Gates</h2>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pb-8">{children}</div>

            {/* Footer */}
            <div className="text-center py-6 text-gray-500">LogiFun</div>
        </div>
    )
}