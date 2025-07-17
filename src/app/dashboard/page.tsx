"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { UserProfile } from "@/components/user-profile"
import { DashboardIllustration } from "@/components/dashborad-illustration"
import { FeatureCard } from "@/components/featured-card"
import { DashboardButton } from "@/components/dashboard-button"
import { SupabaseLogoutButton } from "@/components/auth/supabase-logout-button"
import { BookOpenText, Brain, ClipboardList, Gamepad2, Sparkles } from "lucide-react"
import {SimulatorIcon} from "@/components/simulator/simulator-icon";

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-md flex flex-col gap-2">

        {/* Main Illustration */}
        <DashboardIllustration>
          <UserProfile />
        </DashboardIllustration>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-black">Learn Logic</h1>
          <h1 className="text-3xl font-semibold text-black">Gates</h1>
        </div>

        {/* Feature Cards - First Row */}
        <div className="grid grid-cols-2 gap-2">
          <FeatureCard href="/progression" bgColor="bg-gradient-to-r from-blue-500 to-purple-500" icon={<Sparkles size={60} />} />
          <FeatureCard href="/tujuan-belajar" bgColor="bg-green-500" icon={<ClipboardList size={60} />} />
        </div>

        {/* Feature Cards - Second Row */}
        <div className="grid grid-cols-2 gap-2">
          <FeatureCard href="/materi" bgColor="bg-orange-card" icon={<BookOpenText size={60} />} />
          <FeatureCard href="/kuis" bgColor="bg-lightblue-card" icon={<Brain size={60} />} />
        </div>

        {/* Feature Cards - Third Row */}
        <div className="grid grid-cols-1 gap-2">
          <FeatureCard href="/game" bgColor="bg-magenta-card" icon={<Gamepad2 size={60} />} />
        </div>

        {/* Add Simulator Card */}
        <div className="mt-4">
          <FeatureCard
              href="/simulator"
              bgColor="bg-blue-gradient"
              icon={<SimulatorIcon />}
              label="Logic Gate Simulator"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <DashboardButton href="/about" bgColor="bg-darkblue-button">
            About
          </DashboardButton>
          <DashboardButton href="/penilaian" bgColor="bg-darkblue-button">
            Penilaian
          </DashboardButton>
        </div>

        {/* Logout Button */}
        <SupabaseLogoutButton />

        {/* Footer */}
        <div className="text-center mt-4 text-gray-600">LogiFun</div>
      </div>
    </div>
  )
}

