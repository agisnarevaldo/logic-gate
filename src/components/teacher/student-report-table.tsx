"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Search, Download, Filter, ChevronDown, ExternalLink, Trophy, BookOpen, GamepadIcon } from "lucide-react"
import Link from "next/link"
import { StudentAvatar } from "./student-avatar"
import { createClient } from "@/utils/supabase/client"

interface StudentReport {
    id: string
    full_name: string
    email: string
    avatar_url?: string
    created_at: string
    last_activity: string
    total_score: number
    completed_materials: number
    completed_quizzes: number
    completed_games: number
    current_level: string
    avg_quiz_score: number
    avg_game_score: number
    days_since_last_activity: number
}

interface StudentReportTableProps {
    onExportAll?: (data: StudentReport[]) => void
}

export function StudentReportTable({ onExportAll }: StudentReportTableProps) {
    const [students, setStudents] = useState<StudentReport[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [levelFilter, setLevelFilter] = useState<string>("all")
    const [sortBy, setSortBy] = useState<keyof StudentReport>("last_activity")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [showFilters, setShowFilters] = useState(false)
    const [dateFilter, setDateFilter] = useState<"all" | "week" | "month">("all")

    const supabase = createClient()

    const fetchStudentsReport = useCallback(async () => {
        try {
            setLoading(true)

            // Fetch student profiles
            const { data: profiles, error: profileError } = await supabase
                .from('user_profiles')
                .select('id, full_name, email, avatar_url, created_at')
                .eq('role', 'student')
                .order('created_at', { ascending: false })

            if (profileError) {
                console.error('Error fetching profiles:', profileError)
                return
            }

            if (!profiles || profiles.length === 0) {
                setStudents([])
                return
            }

            const studentIds = profiles.map(p => p.id)

            // Fetch statistics
            const { data: stats } = await supabase
                .from('user_statistics')
                .select('user_id, current_level, total_score, total_materials_completed, total_quizzes_completed, total_games_completed, updated_at')
                .in('user_id', studentIds)

            // Fetch quiz scores for averages
            const { data: quizScores } = await supabase
                .from('user_quiz_scores')
                .select('user_id, score')
                .in('user_id', studentIds)

            // Fetch game scores for averages
            const { data: gameScores } = await supabase
                .from('user_game_scores')
                .select('user_id, score')
                .in('user_id', studentIds)

            // Fetch last activities
            const { data: lastActivities } = await supabase
                .from('user_quiz_scores')
                .select('user_id, completed_at')
                .in('user_id', studentIds)
                .order('completed_at', { ascending: false })

            // Process data
            const studentsReport: StudentReport[] = profiles.map(profile => {
                const stat = stats?.find(s => s.user_id === profile.id)
                const userQuizScores = quizScores?.filter(q => q.user_id === profile.id) || []
                const userGameScores = gameScores?.filter(g => g.user_id === profile.id) || []
                const lastActivity = lastActivities?.find(a => a.user_id === profile.id)

                const avgQuizScore = userQuizScores.length > 0
                    ? Math.round(userQuizScores.reduce((sum, q) => sum + (q.score || 0), 0) / userQuizScores.length)
                    : 0

                const avgGameScore = userGameScores.length > 0
                    ? Math.round(userGameScores.reduce((sum, g) => sum + (g.score || 0), 0) / userGameScores.length)
                    : 0

                const lastActivityDate = lastActivity?.completed_at || stat?.updated_at || profile.created_at
                const daysSinceLastActivity = Math.floor(
                    (new Date().getTime() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
                )

                return {
                    id: profile.id,
                    full_name: profile.full_name || 'Unknown',
                    email: profile.email,
                    avatar_url: profile.avatar_url,
                    created_at: profile.created_at,
                    last_activity: lastActivityDate,
                    total_score: stat?.total_score || 0,
                    completed_materials: stat?.total_materials_completed || 0,
                    completed_quizzes: stat?.total_quizzes_completed || 0,
                    completed_games: stat?.total_games_completed || 0,
                    current_level: stat?.current_level || 'Pemula',
                    avg_quiz_score: avgQuizScore,
                    avg_game_score: avgGameScore,
                    days_since_last_activity: daysSinceLastActivity
                }
            })

            setStudents(studentsReport)
        } catch (error) {
            console.error('Error fetching students report:', error)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        fetchStudentsReport()
    }, [fetchStudentsReport])

    // Filter and sort students
    const filteredAndSortedStudents = useMemo(() => {
        const filtered = students.filter(student => {
            // Search filter
            const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase())

            // Level filter
            const matchesLevel = levelFilter === "all" || student.current_level === levelFilter

            // Date filter
            let matchesDate = true
            if (dateFilter === "week") {
                matchesDate = student.days_since_last_activity <= 7
            } else if (dateFilter === "month") {
                matchesDate = student.days_since_last_activity <= 30
            }

            return matchesSearch && matchesLevel && matchesDate
        })

        // Sort
        filtered.sort((a, b) => {
            const aValue = a[sortBy]
            const bValue = b[sortBy]

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue)
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
            }

            return 0
        })

        return filtered
    }, [students, searchTerm, levelFilter, dateFilter, sortBy, sortOrder])

    const handleSort = (field: keyof StudentReport) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('desc')
        }
    }

    const exportToCSV = (data: StudentReport[], filename: string) => {
        const headers = [
            'Nama',
            'Email',
            'Level',
            'Total Skor',
            'Materi Selesai',
            'Kuis Selesai',
            'Game Selesai',
            'Rata-rata Kuis',
            'Rata-rata Game',
            'Aktivitas Terakhir',
            'Hari Sejak Aktivitas',
            'Tanggal Daftar'
        ]

        const csvContent = [
            headers.join(','),
            ...data.map(student => [
                `"${student.full_name}"`,
                `"${student.email}"`,
                `"${student.current_level}"`,
                student.total_score,
                student.completed_materials,
                student.completed_quizzes,
                student.completed_games,
                student.avg_quiz_score,
                student.avg_game_score,
                `"${new Date(student.last_activity).toLocaleDateString('id-ID')}"`,
                student.days_since_last_activity,
                `"${new Date(student.created_at).toLocaleDateString('id-ID')}"`
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
    }

    const handleExportFiltered = () => {
        exportToCSV(filteredAndSortedStudents, `laporan-siswa-filtered-${new Date().toISOString().split('T')[0]}.csv`)
    }

    const handleExportAll = () => {
        exportToCSV(students, `laporan-siswa-lengkap-${new Date().toISOString().split('T')[0]}.csv`)
        onExportAll?.(students)
    }

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Pemula': return 'bg-gray-100 text-gray-800'
            case 'Dasar': return 'bg-blue-100 text-blue-800'
            case 'Menengah': return 'bg-yellow-100 text-yellow-800'
            case 'Ahli': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getActivityStatus = (days: number) => {
        if (days <= 1) return { color: 'text-green-600', label: 'Sangat Aktif' }
        if (days <= 7) return { color: 'text-blue-600', label: 'Aktif' }
        if (days <= 30) return { color: 'text-yellow-600', label: 'Kurang Aktif' }
        return { color: 'text-red-600', label: 'Tidak Aktif' }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-magenta-card"></div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Header with Search and Filters */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Laporan Siswa</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Menampilkan {filteredAndSortedStudents.length} dari {students.length} siswa
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleExportFiltered}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Download size={16} />
                            Export Filter
                        </button>
                        <button
                            onClick={handleExportAll}
                            className="px-4 py-2 bg-magenta-card text-white rounded-lg hover:opacity-90 flex items-center gap-2"
                        >
                            <Download size={16} />
                            Export Semua
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama atau email siswa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-card focus:border-transparent"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Filter size={16} />
                        Filter
                        <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Level Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                                <select
                                    value={levelFilter}
                                    onChange={(e) => setLevelFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-card focus:border-transparent"
                                >
                                    <option value="all">Semua Level</option>
                                    <option value="Pemula">Pemula</option>
                                    <option value="Dasar">Dasar</option>
                                    <option value="Menengah">Menengah</option>
                                    <option value="Ahli">Ahli</option>
                                </select>
                            </div>

                            {/* Date Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Aktivitas</label>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value as "all" | "week" | "month")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-card focus:border-transparent"
                                >
                                    <option value="all">Semua Waktu</option>
                                    <option value="week">7 Hari Terakhir</option>
                                    <option value="month">30 Hari Terakhir</option>
                                </select>
                            </div>

                            {/* Sort */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as keyof StudentReport)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-card focus:border-transparent"
                                >
                                    <option value="last_activity">Aktivitas Terakhir</option>
                                    <option value="full_name">Nama</option>
                                    <option value="total_score">Total Skor</option>
                                    <option value="current_level">Level</option>
                                    <option value="created_at">Tanggal Daftar</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('full_name')}
                            >
                                Siswa
                                {sortBy === 'full_name' && (
                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('current_level')}
                            >
                                Level
                                {sortBy === 'current_level' && (
                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('total_score')}
                            >
                                Statistik
                                {sortBy === 'total_score' && (
                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('avg_quiz_score')}
                            >
                                Rata-rata
                                {sortBy === 'avg_quiz_score' && (
                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('last_activity')}
                            >
                                Aktivitas
                                {sortBy === 'last_activity' && (
                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedStudents.map((student) => {
                            const activityStatus = getActivityStatus(student.days_since_last_activity)

                            return (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <StudentAvatar
                                                avatar_url={student.avatar_url}
                                                full_name={student.full_name}
                                                size={40}
                                            />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {student.full_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {student.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(student.current_level)}`}>
                                            {student.current_level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-4 text-sm">
                                            <div className="flex items-center">
                                                <Trophy size={14} className="text-yellow-500 mr-1" />
                                                <span>{student.total_score}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <BookOpen size={14} className="text-blue-500 mr-1" />
                                                <span>{student.completed_materials}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <GamepadIcon size={14} className="text-green-500 mr-1" />
                                                <span>{student.completed_games}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            <div>Kuis: {student.avg_quiz_score}%</div>
                                            <div>Game: {student.avg_game_score}%</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            <div className={`font-medium ${activityStatus.color}`}>
                                                {activityStatus.label}
                                            </div>
                                            <div className="text-gray-500">
                                                {student.days_since_last_activity} hari lalu
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link
                                            href={`/guru/siswa/${student.id}`}
                                            className="text-magenta-card hover:text-magenta-card/80 flex items-center gap-1"
                                        >
                                            <ExternalLink size={14} />
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {filteredAndSortedStudents.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500">
                            {students.length === 0 ? 'Belum ada data siswa' : 'Tidak ada siswa yang sesuai dengan filter'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
