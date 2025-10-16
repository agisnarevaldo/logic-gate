"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Menu, Users, BookOpen, Trophy, TrendingUp, Download, Search, Filter } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { SidebarMenu } from "@/components/sidebar-menu"
import { useTeacherData } from "@/hooks/use-teacher-data"

interface AuthUser {
  id: string
  email?: string
  role?: 'student' | 'teacher'
  user_metadata?: {
    name?: string
    avatar_url?: string
  }
}

interface TeacherDashboardContentProps {
  user: AuthUser | null
}

interface Student {
  id: string
  full_name: string
  email: string
  current_level: string
  total_score: number
  completed_materials: number
  completed_quizzes: number
  completed_games: number
  last_activity: string
}

interface Activity {
  student_name: string
  activity_type: string
  activity_name: string
  score: number
  activity_date: string
}

// Overview Card Component
function OverviewCard({
  title,
  value,
  icon: Icon,
  color
}: {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
}) {
  return (
    <div className={`${color} p-6 rounded-lg text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <Icon size={32} className="text-white/80" />
      </div>
    </div>
  )
}

// Activity Item Component
function ActivityItem({ activity }: { activity: Activity }) {
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
      case 'quiz': return 'text-blue-600'
      case 'game': return 'text-green-600'
      case 'material': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0">
      <div className="text-2xl">{getActivityIcon(activity.activity_type)}</div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{activity.student_name}</p>
        <p className="text-sm text-gray-600">
          {activity.activity_type === 'material' ? 'Mengakses' : 'Menyelesaikan'}{' '}
          <span className={getActivityColor(activity.activity_type)}>
            {activity.activity_name}
          </span>
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">
          {activity.activity_type !== 'material' ? `${activity.score}%` : `${activity.score}%`}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(activity.activity_date).toLocaleDateString('id-ID')}
        </p>
      </div>
    </div>
  )
}

// Student Row Component
function StudentRow({ student, onViewDetail }: { student: Student, onViewDetail: (id: string) => void }) {
  const getLastActivityText = (lastActivity: string) => {
    const now = new Date()
    const activity = new Date(lastActivity)
    const diffDays = Math.floor((now.getTime() - activity.getTime()) / (1000 * 3600 * 24))

    if (diffDays === 0) return 'Hari ini'
    if (diffDays === 1) return 'Kemarin'
    if (diffDays < 7) return `${diffDays} hari lalu`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
    return `${Math.floor(diffDays / 30)} bulan lalu`
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

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-orange-600">
              {student.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{student.full_name}</p>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(student.current_level)}`}>
          {student.current_level}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{student.total_score}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{student.completed_materials}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{student.completed_quizzes}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{student.completed_games}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {getLastActivityText(student.last_activity)}
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onViewDetail(student.id)}
          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
        >
          Lihat Detail
        </button>
      </td>
    </tr>
  )
}

export function TeacherDashboardContent({ user }: TeacherDashboardContentProps) {
  const router = useRouter()
  const { overview, activities, students, loading, error, exportStudentsToCSV } = useTeacherData()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")

  // Filter students based on search and level
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || student.current_level === levelFilter
    return matchesSearch && matchesLevel
  })

  const handleViewStudentDetail = (studentId: string) => {
    router.push(`/guru/siswa/${studentId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-card p-4 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-white p-2"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white p-2"
          >
            <Menu size={28} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 text-white">
            <Users size={64} />
          </div>
          <div className="text-center">
            <h1 className="text-white text-3xl font-bold">Dashboard Guru</h1>
            <p className="text-white/80">Selamat datang, {user?.user_metadata?.name || 'Guru'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <OverviewCard
            title="Total Siswa"
            value={overview?.total_students || 0}
            icon={Users}
            color="bg-blue-500"
          />
          <OverviewCard
            title="Kuis Diselesaikan"
            value={overview?.total_quizzes_completed || 0}
            icon={BookOpen}
            color="bg-green-500"
          />
          <OverviewCard
            title="Game Diselesaikan"
            value={overview?.total_games_completed || 0}
            icon={Trophy}
            color="bg-purple-500"
          />
          <OverviewCard
            title="Rata-rata Kuis"
            value={`${overview?.avg_quiz_score || 0}%`}
            icon={TrendingUp}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Students List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Daftar Siswa</h2>
                  <button
                    onClick={exportStudentsToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari siswa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={levelFilter}
                      onChange={(e) => setLevelFilter(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="all">Semua Level</option>
                      <option value="Pemula">Pemula</option>
                      <option value="Dasar">Dasar</option>
                      <option value="Menengah">Menengah</option>
                      <option value="Ahli">Ahli</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siswa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Materi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kuis</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Game</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Terakhir</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <StudentRow
                        key={student.id}
                        student={student}
                        onViewDetail={handleViewStudentDetail}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada siswa yang ditemukan</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
            </div>
            <div className="p-6">
              {activities.length > 0 ? (
                <div className="space-y-1">
                  {activities.slice(0, 10).map((activity, index) => (
                    <ActivityItem key={index} activity={activity} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Belum ada aktivitas</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Menu */}
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}
