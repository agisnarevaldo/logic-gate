"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import { User, ExternalLink, Calendar, Award } from "lucide-react"
import Link from "next/link"

interface Student {
  id: string
  full_name: string
  email: string
  created_at: string
  current_level?: string
  last_activity?: string
  total_score?: number
}

export function TeacherStudentsList() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchStudents = useCallback(async () => {
    try {
      // Fetch students with their statistics
      const { data: studentsData, error: studentsError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          full_name,
          email,
          created_at,
          user_statistics (
            current_level,
            total_score,
            last_activity_date
          )
        `)
        .eq('role', 'student')
        .order('created_at', { ascending: false })

      if (studentsError) {
        console.error('Error fetching students:', studentsError)
        return
      }

      // Transform the data
      const transformedStudents = studentsData?.map(student => ({
        id: student.id,
        full_name: student.full_name || 'Unnamed Student',
        email: student.email,
        created_at: student.created_at,
        current_level: student.user_statistics?.[0]?.current_level || 'Pemula',
        total_score: student.user_statistics?.[0]?.total_score || 0,
        last_activity: student.user_statistics?.[0]?.last_activity_date
      })) || []

      setStudents(transformedStudents)
    } catch (error) {
      console.error('Exception fetching students:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return 'N/A'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Ahli': return 'bg-green-100 text-green-800'
      case 'Menengah': return 'bg-blue-100 text-blue-800'
      case 'Dasar': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Daftar Siswa</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
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
        <h3 className="text-xl font-bold text-gray-800">Daftar Siswa</h3>
        <span className="text-sm text-gray-500">{students.length} siswa</span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User size={48} className="mx-auto mb-3 opacity-50" />
            <p>Belum ada siswa yang terdaftar</p>
          </div>
        ) : (
          students.map(student => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {student.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{student.full_name}</h4>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(student.current_level || 'Pemula')}`}>
                      {student.current_level}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Award size={12} />
                      {student.total_score} poin
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(student.created_at)}
                  </div>
                  {student.last_activity && (
                    <div className="text-xs mt-1">
                      Terakhir aktif: {formatDate(student.last_activity)}
                    </div>
                  )}
                </div>
                <Link href={`/guru/siswa/${student.id}`}>
                  <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
