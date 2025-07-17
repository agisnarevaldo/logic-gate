"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useProgression } from "@/hooks/useProgression"
import { 
  Brain, 
  Lock, 
  CheckCircle, 
  Clock, 
  Zap, 
  Trophy,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Target
} from "lucide-react"
import Link from "next/link"

export default function KuisPage() {
  const [showLoading, setShowLoading] = useState(true)
  const { progressionState, isLoading, error } = useProgression()

  // Static quiz mapping for fallback
  const staticQuizzes = [
    {
      id: 1,
      quiz_code: "GATE_SYMBOLS",
      title: "Simbol Gerbang Logika",
      href: "/kuis/matching",
      description: "Cocokkan simbol gerbang logika dengan namanya",
      difficulty: "easy" as const,
      level: 1,
      estimated_time_minutes: 5,
      xp_reward_pass: 50
    },
    {
      id: 2,
      quiz_code: "BASIC_GATES",
      title: "Gerbang Logika Dasar",
      href: "/kuis/basic-gates", 
      description: "Tes pengetahuan tentang gerbang AND, OR, dan NOT",
      difficulty: "medium" as const,
      level: 2,
      estimated_time_minutes: 10,
      xp_reward_pass: 75
    },
    {
      id: 3,
      quiz_code: "ADVANCED_GATES",
      title: "Gerbang Logika Turunan",
      href: "/kuis/advanced-gates",
      description: "Kuis tentang NAND, NOR, XOR, dan XNOR",
      difficulty: "medium" as const,
      level: 3,
      estimated_time_minutes: 10,
      xp_reward_pass: 100
    },
    {
      id: 4,
      quiz_code: "TRUTH_TABLE",
      title: "Tabel Kebenaran",
      href: "/kuis/truth-table",
      description: "Lengkapi tabel kebenaran berbagai gerbang logika",
      difficulty: "hard" as const,
      level: 4,
      estimated_time_minutes: 12,
      xp_reward_pass: 125
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Mudah'
      case 'medium': return 'Normal'
      case 'hard': return 'Sulit'
      default: return 'Normal'
    }
  }

  const getQuizHref = (quizCode: string) => {
    switch (quizCode) {
      case 'GATE_SYMBOLS': return '/kuis/matching'
      case 'BASIC_GATES': return '/kuis/basic-gates'
      case 'ADVANCED_GATES': return '/kuis/advanced-gates'
      case 'TRUTH_TABLE': return '/kuis/truth-table'
      default: return '/kuis'
    }
  }

  const isProgressionReady = !isLoading && progressionState

  return (
    <>
      <AnimatePresence mode="wait">
        {(showLoading || !isProgressionReady) && (
          <PageLoadingScreen
            bgColor="bg-purple-card"
            icon={<Brain />}
            text="Kuis"
            onComplete={() => setShowLoading(false)}
          />
        )}
      </AnimatePresence>

      <div className={showLoading || !isProgressionReady ? "hidden" : ""}>
        <FeaturePageLayout title="Kuis" icon={<Brain />} bgColor="bg-purple-card">
          <div className="mb-8">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                Quiz & Latihan
              </h3>
              <p className="text-gray-600">
                Uji pemahaman Anda dengan quiz bertahap. Selesaikan quiz secara berurutan untuk unlock level berikutnya!
              </p>
            </div>

            <div className="h-px bg-gray-300 w-full mb-6" />

            {/* Error State */}
            {error && (
              <Card className="p-6 text-center mb-6 bg-red-50 border-red-200">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-700">{error}</p>
              </Card>
            )}

            {/* Progression-based Quizzes */}
            {progressionState && (
              <div className="space-y-4">
                {progressionState.quizzes.map((quizState, index) => {
                  const { quiz, status, unlock_reason } = quizState
                  const isLocked = status === 'locked'
                  const isPassed = status === 'passed'
                  const isFailed = status === 'failed'
                  const isAvailable = status === 'available'

                  return (
                    <Card key={quiz.id} className={`
                      overflow-hidden transition-all duration-300 relative
                      ${isPassed ? 'bg-green-50 border-green-200' : ''}
                      ${isAvailable ? 'bg-purple-50 border-purple-200 hover:shadow-lg' : ''}
                      ${isFailed ? 'bg-red-50 border-red-200 hover:shadow-lg' : ''}
                      ${isLocked ? 'bg-gray-50 border-gray-200 opacity-60' : ''}
                    `}>
                      {/* Level Badge */}
                      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold">
                        Level {quiz.level}
                      </div>

                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Status Icon */}
                          <div className="flex-shrink-0 p-3 bg-white/80 rounded-xl">
                            {isPassed && <Trophy className="w-6 h-6 text-yellow-500" />}
                            {isAvailable && <Brain className="w-6 h-6 text-purple-500" />}
                            {isFailed && <Target className="w-6 h-6 text-red-500" />}
                            {isLocked && <Lock className="w-6 h-6 text-gray-400" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xl font-bold mb-2 text-gray-900">
                              Quiz {index + 1}: {quiz.title}
                            </h4>
                            <p className="text-gray-600 mb-4">
                              Uji pemahaman Anda tentang logic gate
                            </p>

                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{quiz.estimated_time_minutes} menit</span>
                              </div>
                              
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                                {getDifficultyText(quiz.difficulty)}
                              </div>
                              
                              {!isLocked && (
                                <div className="flex items-center gap-1">
                                  <Zap className="w-4 h-4" />
                                  <span>{quiz.xp_reward_pass} XP</span>
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            {isLocked ? (
                              <Button disabled className="w-full">
                                <Lock className="w-4 h-4 mr-2" />
                                Terkunci
                              </Button>
                            ) : (
                              <Link href={getQuizHref(quiz.quiz_code)} className="block">
                                <Button className="w-full">
                                  {isPassed ? (
                                    <>
                                      <Trophy className="w-4 h-4 mr-2" />
                                      Ulangi Quiz
                                    </>
                                  ) : isFailed ? (
                                    <>
                                      <Target className="w-4 h-4 mr-2" />
                                      Coba Lagi
                                    </>
                                  ) : (
                                    <>
                                      <Brain className="w-4 h-4 mr-2" />
                                      Mulai Quiz
                                    </>
                                  )}
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                            )}

                            {/* Lock Reason */}
                            {isLocked && unlock_reason && (
                              <p className="text-xs text-gray-500 mt-2 text-center">
                                {unlock_reason}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Completion Star */}
                      {isPassed && (
                        <div className="absolute top-4 left-4">
                          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Fallback to static quizzes if progression fails */}
            {!progressionState && !isLoading && (
              <div className="space-y-4">
                {staticQuizzes.map((quiz, index) => (
                  <Link key={quiz.id} href={quiz.href} className="block">
                    <Card className="p-6 hover:shadow-lg transition-shadow bg-purple-50 border-purple-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-card text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">{quiz.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{quiz.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{quiz.estimated_time_minutes} menit</span>
                            <span>•</span>
                            <span className={`px-2 py-1 rounded ${getDifficultyColor(quiz.difficulty)}`}>
                              {getDifficultyText(quiz.difficulty)}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Progression Hint */}
            {progressionState && (
              <Card className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <div className="text-center">
                  <Brain className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-purple-700">
                    💡 <strong>Tips:</strong> Lulus quiz dengan minimal 70% untuk unlock quiz level berikutnya dan dapatkan XP!
                  </p>
                </div>
              </Card>
            )}
          </div>
        </FeaturePageLayout>
      </div>
    </>
  )
}
