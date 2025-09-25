"use client"

import { AuthProvider } from "@/providers/auth-provider"
import { SoundEffectsProvider } from "@/providers/sound-effects-provider"
import { ReactNode } from "react"

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SoundEffectsProvider>
        {children}
      </SoundEffectsProvider>
    </AuthProvider>
  )
}