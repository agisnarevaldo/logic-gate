"use client"

import { SessionProvider } from "next-auth/react"

import { ReactNode } from "react";
import { Session } from "next-auth";

export default function ClientLayout({ children, session }: { children: ReactNode, session: Session }) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}