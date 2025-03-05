import Image from "next/image"
import { ReactNode } from "react"

interface DashboardIllustrationProps {
    children: ReactNode
}

export function DashboardIllustration({children}: DashboardIllustrationProps) {
  return (
    <div className="relative w-full h-full bg-blue-gradient rounded-2xl shadow-md flex flex-col items-center justify-center overflow-hidden p-2">
        {children}
        <Image src="/images/decoration.svg" alt="Learning Illustration" width={227} height={242} priority />
    </div>
  ) 
}
