"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { SidebarMenu } from "./sidebar-menu"

interface SidebarButtonProps {
    className?: string
}

export function SidebarButton({ className = "" }: SidebarButtonProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setSidebarOpen(true)}
                className={`fixed top-4 right-4 z-30 p-3 bg-blue-gradient rounded-full text-white shadow-lg hover:shadow-xl transition-shadow ${className}`}
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>
            <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    )
}
