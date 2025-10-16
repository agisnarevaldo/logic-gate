"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Menu } from "lucide-react"
import { SidebarMenu } from "@/components/sidebar-menu"
import { BookIcon } from "@/components/icon"
import { learningMaterials } from "@/data/learning-materials"
import Link from "next/link"
import type { LearningCategory } from "@/types/learning"
import Image from "next/image"

export default function CategoryPage() {
    const router = useRouter()
    const params = useParams()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [category, setCategory] = useState<LearningCategory | null>(null)

    useEffect(() => {
        if (params.slug) {
            const foundCategory = learningMaterials.find((cat) => cat.slug === params.slug)
            setCategory(foundCategory || null)
        }
    }, [params.slug])

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            {/* Header */}
            <div className="bg-orange-card p-4 rounded-b-3xl">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => router.push("/materi")} className="text-white p-2">
                        <ChevronLeft size={28} />
                    </button>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2">
                        <Menu size={28} />
                    </button>
                </div>
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-16 h-16 text-white">
                        <BookIcon />
                    </div>
                    <h1 className="text-white text-5xl font-bold">Materi</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 py-8">
                <h2 className="text-3xl font-bold mb-4 text-center text-white">{category.title}</h2>
                <Image
                    src={category.image}
                    alt={category.title}
                    width={200}
                    height={100}
                    className="mx-auto"
                />
                <p className="text-center text-gray-300 mb-6">{category.description}</p>
                <div className="h-px bg-gray-600 w-full mb-6" />
                <div className="space-y-4">
                    {category.modules
                        .sort((a, b) => a.order - b.order)
                        .map((module, index) => (
                            <Link key={module.id} href={`/materi/${category.slug}/${module.slug}`} className="block">
                                <div className="bg-orange-card text-white p-4 rounded-lg hover:bg-orange-600 transition-colors">
                                    <h4 className="text-xl font-bold">Modul {index + 1}</h4>
                                    <p>{module.title}</p>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-6 text-gray-400">LogiFun</div>

            {/* Sidebar Menu */}
            <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
    )
}
