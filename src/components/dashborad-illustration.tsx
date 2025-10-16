import Image from "next/image"
import { ReactNode } from "react"

interface DashboardIllustrationProps {
  children: ReactNode,
  illustration: string,
  width?: number,
  height?: number,
  classname?: string,
}

// 227 242
export function DashboardIllustration({ children, illustration, width = 227, height = 242, classname }: DashboardIllustrationProps) {
  return (
    <div className="relative w-full h-full bg-blue-gradient rounded-2xl shadow-md flex flex-col gap-2 items-center justify-center overflow-hidden p-2">
      {children}
      <Image src={illustration} className={classname} alt="Learning Illustration" width={width} height={height} priority />
    </div>
  )
}
