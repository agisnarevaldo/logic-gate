"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { BookIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useProgression } from "@/hooks/useProgression"
import { learningMaterials } from "@/data/learning-materials"
import { 
  Lock, 
  CheckCircle, 
  Clock, 
  Zap, 
  BookOpen,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2
} from "lucide-react"

export default function MateriPage() {
    const [showSplashLoading, setShowSplashLoading] = useState(true)
    const { progressionState, isLoading, error } = useProgression()

    // Show splash loading screen initially, then show content when progression is ready
    const isDataReady = !isLoading && (progressionState || error)

    // Hide splash after initial animation OR when data is ready
    useEffect(() => {
        if (isDataReady) {
            // Give small delay to ensure smooth transition
            const timer = setTimeout(() => setShowSplashLoading(false), 300)
            return () => clearTimeout(timer)
        }
    }, [isDataReady])

    return (
        <>
            <AnimatePresence mode="wait">
                {showSplashLoading && (
                    <PageLoadingScreen
                        bgColor="bg-orange-card"
                        icon={<BookIcon />}
                        text="Materi"
                        onComplete={() => {
                            // If data is ready, hide immediately after animation
                            if (isDataReady) {
                                setShowSplashLoading(false)
                            }
                        }}
                    />
                )}
            </AnimatePresence>

            <div className={showSplashLoading ? "hidden" : ""}>
                <FeaturePageLayout title="Materi" icon={<BookIcon />} bgColor="bg-orange-card">
                    <div className="mb-8">
                        <div className="text-center mb-6">
                            <h3 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                                <Sparkles className="w-8 h-8 text-yellow-500" />
                                Materi Pembelajaran
                            </h3>
                            <p className="text-gray-600">
                                Pelajari Logic Gate step by step. Selesaikan materi secara berurutan untuk unlock materi berikutnya!
                            </p>
                        </div>

                        <div className="h-px bg-gray-300 w-full mb-6" />

                        {/* Loading State for Progression Data */}
                        {isLoading && !error && (
                            <Card className="p-8 text-center mb-6 bg-blue-50 border-blue-200">
                                <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
                                <p className="text-blue-700">Memuat progression data...</p>
                            </Card>
                        )}

                        {/* Error State */}
                        {error && (
                            <Card className="p-6 text-center mb-6 bg-red-50 border-red-200">
                                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                <p className="text-red-700">{error}</p>
                                <p className="text-red-600 text-sm mt-2">Menggunakan mode fallback...</p>
                            </Card>
                        )}

                        {/* Progression-based Materials */}
                        {progressionState && !isLoading && (
                            <div className="space-y-4">
                                {progressionState.materials.map((materialState, index) => {
                                    const { material, status } = materialState
                                    const isLocked = status === 'locked'
                                    const isCompleted = status === 'completed'
                                    const isAvailable = status === 'available'

                                    return (
                                        <div key={material.id} className="relative">
                                            <Card className={`
                                                overflow-hidden transition-all duration-300
                                                ${isCompleted ? 'bg-green-50 border-green-200' : ''}
                                                ${isAvailable ? 'bg-blue-50 border-blue-200 hover:shadow-lg' : ''}
                                                ${isLocked ? 'bg-gray-50 border-gray-200 opacity-60' : ''}
                                            `}>
                                                {/* Level Badge */}
                                                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold">
                                                    Level {material.level}
                                                </div>

                                                <div className="p-6">
                                                    <div className="flex items-start gap-4">
                                                        {/* Status Icon */}
                                                        <div className="flex-shrink-0 p-3 bg-white/80 rounded-xl">
                                                            {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
                                                            {isAvailable && <BookOpen className="w-6 h-6 text-blue-500" />}
                                                            {isLocked && <Lock className="w-6 h-6 text-gray-400" />}
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xl font-bold mb-2 text-gray-900">
                                                                Materi {index + 1}: {material.title}
                                                            </h4>
                                                            <p className="text-gray-600 mb-4">
                                                                {material.description}
                                                            </p>

                                                            {/* Metadata */}
                                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>{material.duration_minutes} menit</span>
                                                                </div>
                                                                
                                                                {!isLocked && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Zap className="w-4 h-4" />
                                                                        <span>{material.xp_reward} XP</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Action Button */}
                                                            {isLocked ? (
                                                                <Button disabled className="w-full">
                                                                    <Lock className="w-4 h-4 mr-2" />
                                                                    Terkunci
                                                                </Button>
                                                            ) : (
                                                                <Link href={`/materi/${material.slug}`} className="block">
                                                                    <Button className="w-full">
                                                                        {isCompleted ? (
                                                                            <>
                                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                                Lihat Kembali
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <BookOpen className="w-4 h-4 mr-2" />
                                                                                Mulai Belajar
                                                                            </>
                                                                        )}
                                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                                    </Button>
                                                                </Link>
                                                            )}

                                                            {/* Lock Reason */}
                                                            {isLocked && material.prerequisite_level && (
                                                                <p className="text-xs text-gray-500 mt-2 text-center">
                                                                    Selesaikan materi level {material.prerequisite_level} terlebih dahulu
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Completion Star */}
                                                {isCompleted && (
                                                    <div className="absolute top-4 left-4">
                                                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                                            <Sparkles className="w-4 h-4 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </Card>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Fallback to static materials if progression fails */}
                        {(!progressionState && !isLoading) && (
                            <div className="space-y-4">
                                <Card className="p-4 bg-yellow-50 border-yellow-200 mb-4">
                                    <p className="text-yellow-700 text-sm text-center">
                                        ⚠️ Mode fallback: Progression system tidak tersedia. Menampilkan materi statis.
                                    </p>
                                </Card>
                                {learningMaterials.map((category, index) => (
                                    <Link key={category.id} href={`/materi/${category.slug}`} className="block">
                                        <div className="bg-orange-card text-white p-4 rounded-lg hover:shadow-lg transition-shadow">
                                            <h4 className="text-xl font-bold">Materi {index + 1}</h4>
                                            <p>{category.title}</p>
                                            <p className="text-sm text-white mt-1">{category.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Progression Hint */}
                        {progressionState && (
                            <Card className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                                <div className="text-center">
                                    <Sparkles className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <p className="text-sm text-blue-700">
                                        💡 <strong>Tips:</strong> Selesaikan semua materi di level sebelumnya untuk unlock quiz dan level selanjutnya!
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>
                </FeaturePageLayout>
            </div>
        </>
    )
}