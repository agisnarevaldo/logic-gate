"use client"

import { Users, BookOpen, GamepadIcon, TrendingUp, Award, Clock } from "lucide-react"

interface DashboardOverview {
  total_students: number
  total_quizzes_completed: number
  total_games_completed: number
  total_materials_completed: number
  avg_quiz_score: number
  avg_game_score: number
}

interface TeacherOverviewCardsProps {
  overview: DashboardOverview | null
}

export function TeacherOverviewCards({ overview }: TeacherOverviewCardsProps) {
  const cards = [
    {
      title: "Total Siswa",
      value: overview?.total_students || 0,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Kuis Diselesaikan",
      value: overview?.total_quizzes_completed || 0,
      icon: BookOpen,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Game Dimainkan",
      value: overview?.total_games_completed || 0,
      icon: GamepadIcon,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      title: "Materi Diselesaikan",
      value: overview?.total_materials_completed || 0,
      icon: Award,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      title: "Rata-rata Skor Kuis",
      value: overview?.avg_quiz_score ? `${overview.avg_quiz_score}%` : "0%",
      icon: TrendingUp,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700"
    },
    {
      title: "Rata-rata Skor Game",
      value: overview?.avg_game_score ? `${overview.avg_game_score}%` : "0%",
      icon: Clock,
      color: "bg-pink-500",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon
        return (
          <div
            key={index}
            className={`${card.bgColor} p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <IconComponent size={24} className="text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
