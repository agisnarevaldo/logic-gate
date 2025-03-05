"use client"

import { signOut } from "next-auth/react"
import { DashboardButton } from "./dashboard-button"

export function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <DashboardButton href="#" bgColor="bg-red-button" onClick={handleLogout}>
      Keluar
    </DashboardButton>
  )
}
