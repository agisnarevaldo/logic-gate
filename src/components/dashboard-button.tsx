import Link from "next/link"
import type { ReactNode } from "react"

interface DashboardButtonProps {
  href: string
  bgColor: string
  children: ReactNode
  onClick?: () => void
  classname?: string
}

export function DashboardButton({ href, bgColor, children, onClick, classname }: DashboardButtonProps) {
  return (
    <Link
      href={href}
      className={`${bgColor} rounded-2xl flex items-center justify-center p-4 shadow-md text-white font-medium text-lg transition-transform hover:scale-105 ${classname}`}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}