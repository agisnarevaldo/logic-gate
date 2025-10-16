"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

export function LogoutButton() {
  const { signOut } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (isLoggingOut) return // Prevent multiple clicks

    setIsLoggingOut(true)
    console.log('LogoutButton: Logout clicked')

    try {
      await signOut()
      console.log('LogoutButton: Sign out successful')
      // Don't redirect here, let AuthProvider handle it
    } catch (error) {
      console.error('LogoutButton: Error during logout:', error)
      setIsLoggingOut(false)
      // Fallback redirect on error
      router.push("/login")
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="bg-red-button rounded-2xl flex items-center justify-center p-4 shadow-md text-white font-medium text-lg transition-transform hover:scale-105 w-full disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoggingOut ? "Logging out..." : "Keluar"}
    </button>
  )
}
