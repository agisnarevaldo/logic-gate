"use client"

import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FileText, Download, Calendar, Users, BarChart3 } from "lucide-react"
import { useTeacherData } from "@/hooks/use-teacher-data"
import { AnimatePresence } from "motion/react"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { StudentReportTable } from "@/components/teacher/student-report-table"

export default function LaporanPage() {
    const [showLoading, setShowLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<"overview" | "table">("table")
    const { user, loading, isTeacher } = useAuth()
    const router = useRouter()
    const { overview } = useTeacherData()

    const handleExportAll = (data: unknown[]) => {
        console.log('Exported all data:', data.length, 'students')
    }

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }

        if (!loading && !isTeacher) {
            router.push('/dashboard')
        }
    }, [user, loading, isTeacher, router])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 bg-magenta-card border-t-transparent"></div>
            </div>
        )
    }

    if (!user || !isTeacher) {
        return null
    }

    return (
        <>
            <AnimatePresence mode="wait">
                {showLoading && (
                    <PageLoadingScreen
                        bgColor="bg-magenta-card"
                        text="Memuat laporan"
                        icon={<FileText className="w-16 h-16" />}
                        onComplete={() => setShowLoading(false)}
                    />
                )}
            </AnimatePresence>

            <div className={showLoading ? "hidden" : ""}>

                <FeaturePageLayout title="Laporan Siswa" icon={<BarChart3 size={50} />} backHref="/guru" bgColor="bg-magenta-card">

                    {/* Tab Navigation */}
                    <div className="bg-white rounded-lg shadow-sm mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex">
                                <button
                                    onClick={() => setActiveTab("table")}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === "table"
                                            ? "border-magenta-card text-magenta-card"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <Users size={16} className="inline mr-2" />
                                    Tabel Siswa
                                </button>
                                <button
                                    onClick={() => setActiveTab("overview")}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === "overview"
                                            ? "border-magenta-card text-magenta-card"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <FileText size={16} className="inline mr-2" />
                                    Ringkasan
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === "table" ? (
                        <StudentReportTable onExportAll={handleExportAll} />
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">

                            {/* Overview Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="text-center p-6 bg-blue-50 rounded-lg">
                                    <Users size={32} className="text-blue-600 mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-blue-600">{overview?.total_students || 0}</p>
                                    <p className="text-sm text-gray-600">Total Siswa</p>
                                </div>
                                <div className="text-center p-6 bg-green-50 rounded-lg">
                                    <BarChart3 size={32} className="text-green-600 mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-green-600">{overview?.active_students || 0}</p>
                                    <p className="text-sm text-gray-600">Siswa Aktif</p>
                                </div>
                                <div className="text-center p-6 bg-purple-50 rounded-lg">
                                    <FileText size={32} className="text-purple-600 mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-purple-600">{overview?.total_quizzes_completed || 0}</p>
                                    <p className="text-sm text-gray-600">Kuis Diselesaikan</p>
                                </div>
                                <div className="text-center p-6 bg-orange-50 rounded-lg">
                                    <Calendar size={32} className="text-orange-600 mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-orange-600">{overview?.total_games_completed || 0}</p>
                                    <p className="text-sm text-gray-600">Game Diselesaikan</p>
                                </div>
                            </div>

                            {/* Report Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {/* Summary Report */}
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FileText size={24} className="text-magenta-card" />
                                        <h3 className="text-lg font-semibold">Laporan Ringkasan</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Ringkasan aktivitas semua siswa dalam periode waktu tertentu
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-blue-600">{Math.round(overview?.avg_quiz_score || 0)}%</p>
                                            <p className="text-xs text-gray-600">Rata-rata Kuis</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-green-600">{Math.round(overview?.avg_game_score || 0)}%</p>
                                            <p className="text-xs text-gray-600">Rata-rata Game</p>
                                        </div>
                                    </div>
                                    <button className="w-full bg-magenta-card text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90">
                                        <Download size={16} />
                                        Download PDF
                                    </button>
                                </div>

                                {/* Individual Reports */}
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Users size={24} className="text-blue-600" />
                                        <h3 className="text-lg font-semibold">Laporan Per Siswa</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Laporan detail progress individual setiap siswa
                                    </p>
                                    <button
                                        onClick={() => router.push('/guru/siswa')}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                                    >
                                        Pilih Siswa
                                    </button>
                                </div>

                                {/* Weekly Report */}
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calendar size={24} className="text-green-600" />
                                        <h3 className="text-lg font-semibold">Laporan Mingguan</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Laporan aktivitas siswa dalam 7 hari terakhir
                                    </p>
                                    <button
                                        onClick={() => setActiveTab("table")}
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700"
                                    >
                                        <BarChart3 size={16} />
                                        Lihat Tabel
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}
                </FeaturePageLayout>
            </div>
        </>
    )
}
