"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Menu } from "lucide-react"
import { SidebarMenu } from "../sidebar-menu"

interface SimulatorLayoutProps {
    title: string
    icon: React.ReactNode
    bgColor: string
    children: React.ReactNode
}

export function SimulatorLayout({ title, icon, bgColor, children }: SimulatorLayoutProps) {
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className={`${bgColor} p-4 rounded-b-3xl`}>
                <div className="flex justify-between items-center mb-4 md:mb-8">
                    <button onClick={() => router.push("/dashboard")} className="text-white p-2">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2">
                        <Menu size={24} />
                    </button>
                </div>
                <div className="flex items-center justify-center gap-3 md:gap-4 mb-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 text-white">{icon}</div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white">{title}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-2 md:p-4">{children}</div>

            {/* Footer */}
            <div className="text-center py-4 md:py-6 text-gray-500">LogiFun</div>

            {/* Sidebar Menu */}
            <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
    )
}
