"use client"

import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { UserProfile } from "@/components/user-profile"
import { DashboardIllustration } from "@/components/dashborad-illustration"
import { FeatureCard } from "@/components/featured-card"
import { DashboardButton } from "@/components/dashboard-button"
import { LogoutButton } from "@/components/logout-button"
import { Users, FileText } from "lucide-react"
import { useTeacherData } from "@/hooks/use-teacher-data"

export default function TeacherDashboard() {
    const { user, loading, isTeacher } = useAuth()
    const router = useRouter()
    const { overview } = useTeacherData()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }

        // Redirect non-teachers
        if (!loading && !isTeacher) {
            router.push('/dashboard')
        }
    }, [user, loading, isTeacher, router])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            </div>
        )
    }

    if (!user || !isTeacher) {
        return null
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-4">
            <div className="w-full max-w-md flex flex-col gap-2">

                {/* Main Illustration with Teacher Profile */}
                <DashboardIllustration illustration="/vectors/teacher.svg" width={300} height={300} classname="mt-4">
                    <UserProfile />
                </DashboardIllustration>

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-black">Dashboard</h1>
                    <h1 className="text-3xl font-semibold text-black">Guru</h1>
                </div>

                {/* Feature Cards - Second Row */}
                <FeatureCard
                    href="/guru/siswa"
                    bgColor="bg-orange-card"
                    icon={<Users size={60} />}
                    label={`Daftar Siswa - Total: ${overview?.total_students || 0}`}
                />

                {/* Feature Cards - Third Row */}
                <FeatureCard
                    href="/guru/laporan"
                    bgColor="bg-magenta-card"
                    icon={<FileText size={60} />}
                    label="Laporan"
                />

                {/* Navigation Buttons */}
                <DashboardButton href="/about" bgColor="bg-darkblue-button" classname="w-full">
                    About
                </DashboardButton>

                {/* Logout Button */}
                <LogoutButton />

                {/* Footer */}
                <div className="text-center mt-4 text-gray-600">LogiFun - Dashboard Guru</div>
            </div>
        </div>
    )
}
