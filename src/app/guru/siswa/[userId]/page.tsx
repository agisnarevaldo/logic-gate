"use client"
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Trophy, BookOpen, GamepadIcon, Download, TrendingUp } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { StudentAvatar } from '@/components/teacher/student-avatar'

interface StudentDetail {
    id: string
    full_name: string
    email: string
    current_level: string
    total_score: number
    completed_materials: number
    completed_quizzes: number
    completed_games: number
    last_activity: string
    created_at: string
    avatar_url?: string
}

interface StudentActivity {
    activity_type: string
    activity_name: string
    score: number
    activity_date: string
    details?: string
}

interface StudentProgress {
    material_name: string
    completion_date: string
    progress_percentage: number
}

interface QuizData {
    quiz_title: string
    score: number
    completed_at: string
}

interface GameData {
    game_title: string
    score: number
    completed_at: string
}

interface MaterialData {
    material_title: string
    progress: number
    completed_at: string | null
}



export default function StudentDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [student, setStudent] = useState<StudentDetail | null>(null)
    const [activities, setActivities] = useState<StudentActivity[]>([])
    const [progress, setProgress] = useState<StudentProgress[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const userId = params.userId as string

    const fetchStudentData = useCallback(async () => {
        try {
            setLoading(true)

            // Fetch student basic info from user_profiles
            const { data: profileData, error: profileError } = await supabase
                .from('user_profiles')
                .select('id, full_name, email, created_at, avatar_url')
                .eq('id', userId)
                .single()

            if (profileError) {
                throw new Error(`Error fetching student profile: ${profileError.message}`)
            }

            // Fetch student statistics from user_statistics
            const { data: statsData, error: statsError } = await supabase
                .from('user_statistics')
                .select('user_id, total_score, total_materials_completed, total_quizzes_completed, total_games_completed, current_level, updated_at')
                .eq('user_id', userId)
                .single()

            if (statsError) {
                console.warn('Error fetching student statistics:', statsError)
            }

            // Combine profile and stats data
            const combinedStudentData: StudentDetail = {
                id: profileData.id,
                full_name: profileData.full_name || 'Unknown',
                email: profileData.email,
                current_level: statsData?.current_level || 'Pemula',
                total_score: statsData?.total_score || 0,
                completed_materials: statsData?.total_materials_completed || 0,
                completed_quizzes: statsData?.total_quizzes_completed || 0,
                completed_games: statsData?.total_games_completed || 0,
                last_activity: statsData?.updated_at || profileData.created_at,
                created_at: profileData.created_at,
                avatar_url: profileData.avatar_url
            }

            setStudent(combinedStudentData)

            // Fetch student activities from multiple sources
            // Quiz activities
            const { data: quizData } = await supabase
                .from('user_quiz_scores')
                .select('quiz_title, score, completed_at')
                .eq('user_id', userId)
                .order('completed_at', { ascending: false })
                .limit(20)

            // Game activities
            const { data: gameData } = await supabase
                .from('user_game_scores')
                .select('game_title, score, completed_at')
                .eq('user_id', userId)
                .order('completed_at', { ascending: false })
                .limit(20)

            // Material activities
            const { data: materialData } = await supabase
                .from('user_learning_progress')
                .select('material_title, progress, completed_at')
                .eq('user_id', userId)
                .order('last_accessed_at', { ascending: false })
                .limit(20)

            // Combine and format activities
            const allActivities: StudentActivity[] = [
                // Quiz activities
                ...(quizData || []).map((quiz: QuizData) => ({
                    activity_type: 'quiz',
                    activity_name: quiz.quiz_title || 'Quiz',
                    score: quiz.score || 0,
                    activity_date: quiz.completed_at
                })),

                // Game activities
                ...(gameData || []).map((game: GameData) => ({
                    activity_type: 'game',
                    activity_name: game.game_title || 'Game',
                    score: game.score || 0,
                    activity_date: game.completed_at
                })),

                // Material activities
                ...(materialData || []).map((material: MaterialData) => ({
                    activity_type: 'material',
                    activity_name: material.material_title || 'Materi',
                    score: material.progress || 0,
                    activity_date: material.completed_at || new Date().toISOString()
                }))
            ]

            // Sort by date and take latest 50
            const sortedActivities = allActivities
                .sort((a, b) => new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime())
                .slice(0, 50)

            setActivities(sortedActivities)

            // Fetch material progress from user_learning_progress
            const { data: progressData, error: progressError } = await supabase
                .from('user_learning_progress')
                .select('material_title, progress, completed_at, last_accessed_at')
                .eq('user_id', userId)
                .order('last_accessed_at', { ascending: false })

            if (progressError) {
                console.error('Error fetching progress:', progressError)
                setProgress([])
            } else {
                const formattedProgress = progressData?.map((item) => ({
                    material_name: item.material_title || 'Unknown Material',
                    completion_date: item.completed_at || item.last_accessed_at,
                    progress_percentage: item.progress || 0
                })) || []
                setProgress(formattedProgress)
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
        } finally {
            setLoading(false)
        }
    }, [userId, supabase])

    useEffect(() => {
        if (userId) {
            fetchStudentData()
        }
    }, [userId, fetchStudentData])

    const exportStudentData = async () => {
        if (!student) return

        try {
            // Create CSV content
            const csvContent = [
                ['Data Siswa'],
                ['Nama', student.full_name],
                ['Email', student.email],
                ['Level', student.current_level],
                ['Total Skor', student.total_score.toString()],
                ['Materi Selesai', student.completed_materials.toString()],
                ['Kuis Selesai', student.completed_quizzes.toString()],
                ['Game Selesai', student.completed_games.toString()],
                [''],
                ['Aktivitas Terbaru'],
                ['Tanggal', 'Tipe', 'Nama', 'Skor'],
                ...activities.map(activity => [
                    new Date(activity.activity_date).toLocaleDateString('id-ID'),
                    activity.activity_type,
                    activity.activity_name,
                    activity.score.toString()
                ])
            ].map(row => row.join(',')).join('\n')

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `data-siswa-${student.full_name.replace(/\s+/g, '-').toLowerCase()}.csv`
            link.click()
        } catch (err) {
            console.error('Error exporting data:', err)
        }
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'quiz': return '📝'
            case 'game': return '🎮'
            case 'material': return '📚'
            default: return '📌'
        }
    }

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'quiz': return 'text-blue-600 bg-blue-50'
            case 'game': return 'text-green-600 bg-green-50'
            case 'material': return 'text-purple-600 bg-purple-50'
            default: return 'text-gray-600 bg-gray-50'
        }
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        )
    }

    if (error || !student) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
                    <p className="text-gray-600 mb-4">{error || 'Siswa tidak ditemukan'}</p>
                    <button
                        onClick={() => router.push('/guru')}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-orange-card p-4 rounded-b-3xl">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => router.push('/guru/siswa')}
                        className="text-white p-2"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <div className="text-center flex-1">
                        <h1 className="text-white text-2xl font-bold">Detail Siswa</h1>
                        <p className="text-white/80">{student.full_name}</p>
                    </div>
                    <button
                        onClick={exportStudentData}
                        className="text-white p-2"
                    >
                        <Download size={28} />
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Student Overview */}
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <div className="p-6">
                        <div className="flex items-center gap-6 mb-6">
                            <StudentAvatar
                                avatar_url={student.avatar_url}
                                full_name={student.full_name}
                                size={64}
                                className=""
                            />
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900">{student.full_name}</h2>
                                <p className="text-gray-600">{student.email}</p>
                                <div className="mt-2">
                                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getLevelColor(student.current_level)}`}>
                                        {student.current_level}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <TrendingUp size={24} className="text-blue-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-blue-600">{student.total_score}</p>
                                <p className="text-sm text-gray-600">Total Skor</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <BookOpen size={24} className="text-purple-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-purple-600">{student.completed_materials}</p>
                                <p className="text-sm text-gray-600">Materi Selesai</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <Trophy size={24} className="text-green-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-green-600">{student.completed_quizzes}</p>
                                <p className="text-sm text-gray-600">Kuis Selesai</p>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                <GamepadIcon size={24} className="text-orange-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-orange-600">{student.completed_games}</p>
                                <p className="text-sm text-gray-600">Game Selesai</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activities */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
                        </div>
                        <div className="p-6">
                            {activities.length > 0 ? (
                                <div className="space-y-4">
                                    {activities.slice(0, 10).map((activity, index) => (
                                        <div key={index} className={`p-4 rounded-lg ${getActivityColor(activity.activity_type)}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">{getActivityIcon(activity.activity_type)}</div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{activity.activity_name}</p>
                                                    <p className="text-sm opacity-75">
                                                        {activity.activity_type === 'material' ? 'Mengakses' : 'Menyelesaikan'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">{activity.score}%</p>
                                                    <p className="text-xs opacity-75">
                                                        {new Date(activity.activity_date).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Belum ada aktivitas</p>
                            )}
                        </div>
                    </div>

                    {/* Material Progress */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Progress Materi</h3>
                        </div>
                        <div className="p-6">
                            {progress.length > 0 ? (
                                <div className="space-y-4">
                                    {progress.map((item, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-900">{item.material_name}</h4>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(item.completion_date).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-orange-600 h-2 rounded-full"
                                                    style={{ width: `${item.progress_percentage}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{item.progress_percentage}% selesai</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Belum ada progress materi</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
