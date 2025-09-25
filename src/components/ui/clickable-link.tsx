"use client"

import { useSoundEffects } from "@/hooks/use-sound-effects"
import Link from "next/link"
import { AnchorHTMLAttributes, ReactNode } from "react"

interface ClickableLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    children: ReactNode
    href: string
    playSound?: boolean // Option to disable sound for specific links
}

export function ClickableLink({
    children,
    href,
    onClick,
    playSound = true,
    ...props
}: ClickableLinkProps) {
    const { playClickSound } = useSoundEffects()

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (playSound) {
            playClickSound()
        }
        if (onClick) {
            onClick(event)
        }
    }

    return (
        <Link href={href} {...props} onClick={handleClick}>
            {children}
        </Link>
    )
}
