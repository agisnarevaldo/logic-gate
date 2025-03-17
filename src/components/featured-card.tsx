import Link from "next/link"
import type { ReactNode } from "react"

interface FeatureCardProps {
  href: string
  bgColor: string
  icon: ReactNode
  label?: string
}

export function FeatureCard({ href, bgColor, icon, label }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className={`${bgColor} rounded-2xl flex items-center justify-center p-6 shadow-md transition-transform hover:scale-105`}
    >
      <div className="flex flex-col items-center">
        <div className="text-white w-16 h-16">{icon}</div>
        {label && <span className="mt-2 text-white font-medium">{label}</span>}
      </div>
    </Link>
  )
}
