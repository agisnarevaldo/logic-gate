"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface SidebarToggleProps {
  onClick: () => void
  className?: string
}

export function SidebarToggle({ onClick, className = "" }: SidebarToggleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`bg-white shadow-lg hover:bg-gray-50 ${className}`}
    >
      <Plus className="w-5 h-5" />
      <span className="ml-2 sm:inline">Komponen</span>
    </Button>
  )
}
