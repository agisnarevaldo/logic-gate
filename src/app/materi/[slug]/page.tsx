"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Menu, CheckCircle, Clock, Trophy, Lock } from "lucide-react"
import { SidebarMenu } from "@/components/sidebar-menu"
import { BookIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { learningMaterials } from "@/data/learning-materials"
import { useProgression } from "@/hooks/useProgression"
import Link from "next/link"
import type { LearningCategory } from "@/types/learning"

export default function CategoryPage() {
    const router = useRouter()
    const params = useParams()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [category, setCategory] = useState<LearningCategory | null>(null)
    const [isCompleting, setIsCompleting] = useState(false)
    
    const { progressionState, completeMaterial } = useProgression()

    useEffect(() => {
        if (params.slug) {
            const foundCategory = learningMaterials.find((cat) => cat.slug === params.slug)
            setCategory(foundCategory || null)
        }
    }, [params.slug])

    // Check if this material is accessible based on progression
    const getMaterialState = () => {
        if (!progressionState || !category) return null
        
        return progressionState.materials.find(
            m => m.material.slug === category.slug
        )
    }

    const materialState = getMaterialState()
    const isLocked = materialState?.status === 'locked'
    const isCompleted = materialState?.status === 'completed'

    const handleComplete = async () => {
        if (!category || isCompleting) return
        
        setIsCompleting(true)
        try {
            const success = await completeMaterial(category.slug)
            if (success) {
                // Show success animation or redirect
                setTimeout(() => {
                    router.push('/materi')
                }, 1500)
            }
        } catch (error) {
            console.error('Error completing material:', error)
        } finally {
            setIsCompleting(false)
        }
    }

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    // If material is locked, show lock screen
    if (isLocked) {
        return (
            <div className="min-h-screen flex flex-col">
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

                {/* Locked Content */}
                <div className="flex-1 px-4 py-8">
                    <Card className="p-8 text-center max-w-md mx-auto">
                        <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">Materi Terkunci</h2>
                        <p className="text-gray-600 mb-6">
                            Selesaikan materi level sebelumnya untuk mengakses materi ini.
                        </p>
                        <Button onClick={() => router.push('/materi')}>
                            Kembali ke Daftar Materi
                        </Button>
                    </Card>
                </div>

                <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
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
                <div className="max-w-4xl mx-auto">
                    {/* Material Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold mb-2">{category.title}</h2>
                        <p className="text-gray-600 mb-4">{category.description}</p>
                        
                        {/* Progress Info */}
                        {materialState && (
                            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{materialState.material.duration_minutes} menit</span>
                                </div>
                                {!isCompleted && (
                                    <div className="flex items-center gap-1">
                                        <Trophy className="w-4 h-4" />
                                        <span>{materialState.material.xp_reward} XP</span>
                                    </div>
                                )}
                                {isCompleted && (
                                    <div className="flex items-center gap-1 text-green-600">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Selesai</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-gray-300 w-full mb-6" />

                    {/* Module List */}
                    <div className="space-y-4 mb-8">
                        {category.modules
                            .sort((a, b) => a.order - b.order)
                            .map((module, index) => (
                                <Link key={module.id} href={`/materi/${category.slug}/${module.slug}`} className="block">
                                    <Card className="p-4 hover:shadow-lg transition-shadow bg-orange-50 border-orange-200">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-orange-card text-white rounded-full flex items-center justify-center font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-gray-900">{module.title}</h4>
                                                <p className="text-sm text-gray-600">Modul {index + 1}</p>
                                            </div>
                                            <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                    </div>

                    {/* Completion Button */}
                    {!isCompleted && materialState && (
                        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                            <div className="text-center">
                                <Trophy className="w-8 h-8 text-green-500 mx-auto mb-3" />
                                <h3 className="font-bold text-gray-900 mb-2">
                                    Selesaikan Materi
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Sudah selesai membaca semua modul? Klik tombol di bawah untuk menandai materi ini selesai 
                                    dan dapatkan {materialState.material.xp_reward} XP!
                                </p>
                                <Button 
                                    onClick={handleComplete}
                                    disabled={isCompleting}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {isCompleting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Menyelesaikan...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Selesaikan Materi
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    )}

                    {/* Already Completed */}
                    {isCompleted && (
                        <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-300">
                            <div className="text-center">
                                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                                <h3 className="font-bold text-green-800 mb-2">
                                    Materi Selesai! 🎉
                                </h3>
                                <p className="text-green-700 mb-4">
                                    Anda telah menyelesaikan materi ini. Lanjutkan ke quiz atau materi berikutnya!
                                </p>
                                <div className="flex gap-2 justify-center">
                                    <Button variant="outline" onClick={() => router.push('/kuis')}>
                                        Ke Quiz
                                    </Button>
                                    <Button onClick={() => router.push('/materi')}>
                                        Materi Lainnya
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-6 text-gray-500">LogiFun</div>

            {/* Sidebar Menu */}
            <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
    )
}
