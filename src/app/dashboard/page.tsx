"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { UserProfile } from "@/components/user-profile"
import { DashboardIllustration } from "@/components/dashborad-illustration"
import { FeatureCard } from "@/components/featured-card"
import { DashboardButton } from "@/components/dashboard-button"
import { LogoutButton } from "@/components/logout-button"
import { BookOpenText, Brain, ClipboardList, Gamepad2 } from "lucide-react"
import {SimulatorIcon} from "@/components/simulator/simulator-icon";

export default function Dashboard() {
  // const { data: session, status } = useSession()
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
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
          <FeatureCard href="/tujuan-belajar" bgColor="bg-green-500" icon={<ClipboardList size={60} />} />
          <FeatureCard href="/materi" bgColor="bg-orange-card" icon={<BookOpenText size={60} />} />
        </div>

        {/* Feature Cards - Second Row */}
        <div className="grid grid-cols-2 gap-2">
          <FeatureCard href="/game" bgColor="bg-magenta-card" icon={<Gamepad2 size={60} />} />
          <FeatureCard href="/kuis" bgColor="bg-lightblue-card" icon={<Brain size={60} />} />
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
        <LogoutButton />

        {/* Footer */}
        <div className="text-center mt-4 text-gray-600">LogiFun</div>
      </div>
    </div>
  )
}

