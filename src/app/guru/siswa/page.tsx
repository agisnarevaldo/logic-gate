"use client"

import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Users, Search } from "lucide-react"
import { useTeacherData } from "@/hooks/use-teacher-data"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { StudentAvatar } from "@/components/teacher/student-avatar"

export default function DaftarSiswaPage() {
    const [showLoading, setShowLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const { user, loading, isTeacher } = useAuth()
    const router = useRouter()
    const { students, loading: dataLoading } = useTeacherData()

    // Filter students based on search query
    const filteredStudents = students?.filter(student =>
        student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    // Debug logging
    console.log('DaftarSiswaPage: students data:', students)
    console.log('DaftarSiswaPage: dataLoading:', dataLoading)

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }

        if (!loading && !isTeacher) {
            router.push('/dashboard')
        }
    }, [user, loading, isTeacher, router])

    if (loading || dataLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
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
                        bgColor="bg-orange-500"
                        text="Memuat data siswa"
                        icon={<Users className="w-16 h-16" />}
                        onComplete={() => setShowLoading(false)}
                    />
                )}
            </AnimatePresence>

            <div className={showLoading ? "hidden" : ""}>
                <FeaturePageLayout title="Daftar Siswa" icon={<Users size={50} />} backHref="/guru" bgColor="bg-orange-500">
                    {/* Search Bar */}
                    <div className="bg-white p-4 shadow-sm">
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari siswa..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>

                    {/* Students List */}
                    <div className="bg-white rounded-lg shadow-sm">
                        {filteredStudents && filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <div
                                    key={student.id}
                                    onClick={() => router.push(`/guru/siswa/${student.id}`)}
                                    className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer last:border-b-0"
                                >
                                    <StudentAvatar
                                        avatar_url={student.avatar_url}
                                        full_name={student.full_name}
                                        size={48}
                                        className=""
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{student.full_name}</h3>
                                        <p className="text-sm text-gray-600">{student.email}</p>
                                        <p className="text-xs text-gray-500">
                                            Level: {student.current_level} • Score: {student.total_score}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-orange-600">
                                            {student.completed_materials + student.completed_quizzes + student.completed_games} aktivitas
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(student.last_activity).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-8 text-gray-500">
                                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                                {searchQuery ? (
                                    <>
                                        <p>Tidak ada siswa yang ditemukan untuk &ldquo;{searchQuery}&rdquo;</p>
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="mt-2 text-orange-600 hover:text-orange-700 text-sm"
                                        >
                                            Hapus pencarian
                                        </button>
                                    </>
                                ) : (
                                    <p>Belum ada siswa terdaftar</p>
                                )}
                            </div>
                        )}
                    </div>
                </FeaturePageLayout>
            </div>
        </>
    )
}
