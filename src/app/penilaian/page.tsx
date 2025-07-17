"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { AcademicStatsCard } from "@/components/academic/academic-stats-card"
import { DebugAcademicPanel } from "@/components/debug/debug-academic-panel"
import { ChartBar } from "lucide-react"

export default function PenilaianPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <FeaturePageLayout 
      title="Penilaian Akademik" 
      icon={<ChartBar size={60} />} 
      bgColor="bg-purple-500"
    >
      <div className="space-y-6">
        {/* Academic Statistics */}
        <div className="w-full">
          <AcademicStatsCard />
        </div>

        {/* Quiz Performance Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Performance Overview</h3>
          <div className="text-sm text-gray-600">
            <p className="mb-2">Statistik ini menunjukkan performa Anda dalam berbagai quiz:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Total Quiz:</strong> Jumlah quiz yang telah diselesaikan</li>
              <li><strong>Rata-rata Skor:</strong> Skor rata-rata dari semua quiz</li>
              <li><strong>Skor Tertinggi:</strong> Skor terbaik yang pernah dicapai</li>
              <li><strong>Level Mastery:</strong> Tingkat penguasaan materi</li>
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🎯 Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/kuis')}
              className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              📝 Ambil Quiz
            </button>
            <button
              onClick={() => router.push('/materi')}
              className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              📚 Pelajari Materi
            </button>
          </div>
        </div>

        {/* Debug Panel (hanya untuk development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-50 rounded-lg p-4">
            <DebugAcademicPanel />
          </div>
        )}
      </div>
    </FeaturePageLayout>
  )
}
