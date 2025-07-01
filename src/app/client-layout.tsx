"use client"

import { SessionProvider } from "next-auth/react"
import { SessionErrorHandler } from "@/components/session-error-handler"

import { ReactNode } from "react";
import { Session } from "next-auth";

export default function ClientLayout({ children, session }: { children: ReactNode, session: Session | null }) {
  return (
    <SessionProvider session={session}>
      <SessionErrorHandler />
      {children}
    </SessionProvider>
  )
}