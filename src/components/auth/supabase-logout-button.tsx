"use client"

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function SupabaseLogoutButton() {
  const { signOut, user } = useAuth()

  if (!user) return null

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      size="lg"
      className="flex items-center gap-2 p-4 cursor-pointer"
    >
      <LogOut className="w-4 h-4" />
      Keluar
    </Button>
  )
}
