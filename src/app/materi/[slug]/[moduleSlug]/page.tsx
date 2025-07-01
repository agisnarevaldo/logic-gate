"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Menu, ChevronRight } from "lucide-react"
import { SidebarMenu } from "@/components/sidebar-menu"
import { learningMaterials } from "@/data/learning-materials"
import type { LearningModule, LearningCategory } from "@/types/learning"
import ReactMarkdown from "react-markdown"

export default function ModulePage() {
    const router = useRouter()
    const params = useParams()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [module, setModule] = useState<LearningModule | null>(null)
    const [category, setCategory] = useState<LearningCategory | null>(null)
    const [prevModule, setPrevModule] = useState<{module: LearningModule, categorySlug: string} | null>(null)
    const [nextModule, setNextModule] = useState<{module: LearningModule, categorySlug: string} | null>(null)

    useEffect(() => {
        if (params.slug && params.moduleSlug) {
            const foundCategory = learningMaterials.find((cat) => cat.slug === params.slug)
            if (foundCategory) {
                const foundModule = foundCategory.modules.find((mod) => mod.slug === params.moduleSlug)
                if (foundModule) {
                    setModule(foundModule)
                    setCategory(foundCategory)
                    
                    // Find previous and next modules
                    findPrevNextModules(foundModule)
                } else {
                    setModule(null)
                    setCategory(null)
                }
            } else {
                setModule(null)
                setCategory(null)
            }
        }
    }, [params.slug, params.moduleSlug])

    const findPrevNextModules = (currentModule: LearningModule) => {
        // Get all modules from all categories in order
        const allModules: {module: LearningModule, categorySlug: string}[] = []
        
        learningMaterials.forEach(cat => {
            cat.modules.forEach(mod => {
                allModules.push({module: mod, categorySlug: cat.slug})
            })
        })

        // Sort by category order and module order
        allModules.sort((a, b) => {
            const catA = learningMaterials.find(c => c.slug === a.categorySlug)
            const catB = learningMaterials.find(c => c.slug === b.categorySlug)
            
            if (catA && catB) {
                const catIndexA = learningMaterials.indexOf(catA)
                const catIndexB = learningMaterials.indexOf(catB)
                
                if (catIndexA !== catIndexB) {
                    return catIndexA - catIndexB
                }
            }
            
            return a.module.order - b.module.order
        })

        const currentIndex = allModules.findIndex(
            item => item.module.id === currentModule.id
        )

        if (currentIndex > 0) {
            setPrevModule(allModules[currentIndex - 1])
        } else {
            setPrevModule(null)
        }

        if (currentIndex < allModules.length - 1) {
            setNextModule(allModules[currentIndex + 1])
        } else {
            setNextModule(null)
        }
    }

    const handleNavigation = (targetModule: {module: LearningModule, categorySlug: string}) => {
        router.push(`/materi/${targetModule.categorySlug}/${targetModule.module.slug}`)
    }

    if (!module || !category) {
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
                    <button onClick={() => router.push(`/materi/${category.slug}`)} className="text-white p-2">
                        <ChevronLeft size={28} />
                    </button>
                    <div className="text-white text-center flex-1">
                        <h1 className="text-lg font-semibold">{module.title}</h1>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2">
                        <Menu size={28} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 py-6">
                <div className="bg-white rounded-lg shadow-md p-6 markdown-content">
                    <ReactMarkdown 
                        components={{
                            table: ({children}) => (
                                <div className="overflow-x-auto mb-4">
                                    <table className="w-full border-collapse border border-gray-300">
                                        {children}
                                    </table>
                                </div>
                            ),
                            th: ({children}) => (
                                <th className="border border-gray-300 p-3 bg-orange-100 font-semibold text-center">
                                    {children}
                                </th>
                            ),
                            td: ({children}) => (
                                <td className="border border-gray-300 p-3 text-center">
                                    {children}
                                </td>
                            )
                        }}
                    >
                        {module.content}
                    </ReactMarkdown>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-6">
                    {prevModule ? (
                        <button
                            onClick={() => handleNavigation(prevModule)}
                            className="flex items-center gap-2 bg-orange-card text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            <ChevronLeft size={20} />
                            <div className="text-left">
                                <div className="text-xs opacity-80">Sebelumnya</div>
                                <div className="text-sm font-medium">{prevModule.module.title}</div>
                            </div>
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {nextModule ? (
                        <button
                            onClick={() => handleNavigation(nextModule)}
                            className="flex items-center gap-2 bg-orange-card text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            <div className="text-right">
                                <div className="text-xs opacity-80">Selanjutnya</div>
                                <div className="text-sm font-medium">{nextModule.module.title}</div>
                            </div>
                            <ChevronRight size={20} />
                        </button>
                    ) : (
                        <div></div>
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
