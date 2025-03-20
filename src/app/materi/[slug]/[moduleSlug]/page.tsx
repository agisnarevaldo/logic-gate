"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Menu } from "lucide-react"
import { SidebarMenu } from "@/components/sidebar-menu"
import { learningMaterials } from "@/data/learning-materials"
import type { LearningModule } from "@/types/learning"
import ReactMarkdown from "react-markdown"

export default function ModulePage() {
    const router = useRouter()
    const params = useParams()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [module, setModule] = useState<LearningModule | null>(null)
    const [categorySlug, setCategorySlug] = useState<string | null>(null)

    useEffect(() => {
        if (params.slug && params.moduleSlug) {
            const category = learningMaterials.find((cat) => cat.slug === params.slug)
            if (category) {
                const foundModule = category.modules.find((mod) => mod.slug === params.moduleSlug)
                setModule(foundModule || null)
                setCategorySlug(category.slug)
            }
        }
    }, [params.slug, params.moduleSlug])

    if (!module) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-orange-card p-4 rounded-b-3xl">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => router.push(`/materi/${categorySlug}`)} className="text-white p-2">
                        <ChevronLeft size={28} />
                    </button>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2">
                        <Menu size={28} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 py-6">
                <div className="bg-white rounded-lg shadow-md p-6 markdown-content">
                    <ReactMarkdown>{module.content}</ReactMarkdown>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-6 text-gray-500">LogiFun</div>

            {/* Sidebar Menu */}
            <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
    )
}
