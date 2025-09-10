"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, TrendingUp, Target, Award } from 'lucide-react'
import { useAssessmentData } from '@/hooks/use-assessment-data'

export function AssessmentOverview() {
  const { overviewData, loading } = useAssessmentData()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      icon: Trophy,
      title: "Total Skor",
      value: overviewData.totalScore,
      subtitle: "Poin terkumpul",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: TrendingUp,
      title: "Rata-rata Quiz",
      value: `${overviewData.averageQuizScore}%`,
      subtitle: overviewData.totalQuizzes ? `dari ${overviewData.totalQuizzes} quiz` : "Belum ada quiz",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Target,
      title: "Rata-rata Game",
      value: `${overviewData.averageGameScore}%`,
      subtitle: overviewData.totalGames ? `dari ${overviewData.totalGames} games` : "Belum ada game",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Award,
      title: "Level Belajar",
      value: overviewData.currentLevel,
      subtitle: `${overviewData.completedMaterials}/8 materi`,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Ringkasan Pencapaian</h2>
        <Badge variant="outline" className="text-sm">
          Pembaruan Terakhir: {new Date().toLocaleDateString('id-ID')}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
