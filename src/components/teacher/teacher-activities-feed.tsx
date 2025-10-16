"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import { Activity, BookOpen, GamepadIcon, Award, Clock } from "lucide-react"

interface StudentActivity {
  user_id: string
  student_name: string
  activity_type: 'quiz' | 'game' | 'material'
  activity_name: string
  score: number
  activity_date: string
}

export function TeacherActivitiesFeed() {
  const [activities, setActivities] = useState<StudentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchRecentActivities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('student_activities')
        .select('*')
        .order('activity_date', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Error fetching activities:', error)
        return
      }

      setActivities(data || [])
    } catch (error) {
      console.error('Exception fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchRecentActivities()
  }, [fetchRecentActivities])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz': return BookOpen
      case 'game': return GamepadIcon
      case 'material': return Award
      default: return Activity
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'bg-green-100 text-green-600'
      case 'game': return 'bg-purple-100 text-purple-600'
      case 'material': return 'bg-orange-100 text-orange-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getActivityTypeText = (type: string) => {
    switch (type) {
      case 'quiz': return 'Kuis'
      case 'game': return 'Game'
      case 'material': return 'Materi'
      default: return 'Aktivitas'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    try {
      const now = new Date()
      const activityDate = new Date(dateString)
      const diffMs = now.getTime() - activityDate.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)

      if (diffDays > 0) {
        return `${diffDays} hari yang lalu`
      } else if (diffHours > 0) {
        return `${diffHours} jam yang lalu`
      } else {
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        return diffMinutes > 0 ? `${diffMinutes} menit yang lalu` : 'Baru saja'
      }
    } catch {
      return 'N/A'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Aktivitas Terbaru</h3>
        <Activity size={20} className="text-gray-400" />
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity size={48} className="mx-auto mb-3 opacity-50" />
            <p>Belum ada aktivitas siswa</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.activity_type)
            return (
              <div
                key={index}
                className="flex items-start space-x-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-full ${getActivityColor(activity.activity_type)}`}>
                  <IconComponent size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {activity.student_name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} />
                      {formatTimeAgo(activity.activity_date)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    Menyelesaikan {getActivityTypeText(activity.activity_type).toLowerCase()}:
                    <span className="font-medium ml-1">{activity.activity_name}</span>
                  </p>

                  {activity.activity_type !== 'material' && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Skor:</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${activity.score >= 80
                          ? 'bg-green-100 text-green-700'
                          : activity.score >= 60
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {activity.score}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            Lihat semua aktivitas →
          </button>
        </div>
      )}
    </div>
  )
}
