"use client"

import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { BarChart3 } from "lucide-react"
import { AssessmentOverview } from "@/components/assessment/assessment-overview"
import { LearningProgress } from "@/components/assessment/learning-progress"
import { ScoreHistory } from "@/components/assessment/score-history"

export default function PenilaianPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <FeaturePageLayout
      title="Penilaian"
      icon={<BarChart3 size={60} />}
      bgColor="bg-purple-500"
      backHref="/dashboard"
    >
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Assessment Overview */}
        <AssessmentOverview />
        
        {/* Learning Progress */}
        <LearningProgress />
        
        {/* Score History */}
        <ScoreHistory />
      </div>
    </FeaturePageLayout>
  )
}
