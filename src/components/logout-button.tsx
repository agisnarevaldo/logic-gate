"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { DashboardButton } from "./dashboard-button"

export function LogoutButton() {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <DashboardButton href="#" bgColor="bg-red-button" onClick={handleLogout}>
      Keluar
    </DashboardButton>
  )
}
