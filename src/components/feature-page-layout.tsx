"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Menu } from "lucide-react"
import { SidebarMenu } from "./sidebar-menu"

interface FeaturePageLayoutProps {
    title: string
    icon: React.ReactNode
    bgColor: string
    children: React.ReactNode
    backHref?: string
}

export function FeaturePageLayout({ title, icon, bgColor, children, backHref = "/dashboard" }: FeaturePageLayoutProps) {
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className={`${bgColor} p-3 md:p-4 rounded-b-3xl`}>
                <div className="flex justify-between items-center mb-4 md:mb-8">
                    <button onClick={() => router.push(backHref)} className="text-white p-2">
                        <ChevronLeft size={24} className="md:w-7 md:h-7" />
                    </button>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2">
                        <Menu size={24} className="md:w-7 md:h-7" />
                    </button>
                </div>
                <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 text-white">{icon}</div>
                    <h1 className="text-white text-2xl md:text-5xl font-bold">{title}</h1>
                </div>
            </div>

            {/* Title */}
            <div className="text-center my-4 md:my-8">
                <h2 className="text-2xl md:text-4xl font-semibold text-gray-800">Belajar Gerbang Logika</h2>
            </div>

            {/* Content */}
            <div className="flex-1 px-2 md:px-4 pb-4 md:pb-8">{children}</div>

            {/* Footer */}
            <div className="text-center py-6 text-gray-500">LogiFun</div>

            {/* Sidebar Menu */}
            <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
    )
}
