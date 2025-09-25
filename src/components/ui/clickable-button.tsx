"use client"

import { useSoundEffects } from "@/hooks/use-sound-effects"
import { ButtonHTMLAttributes, ReactNode } from "react"

interface ClickableButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    playSound?: boolean // Option to disable sound for specific buttons
}

export function ClickableButton({
    children,
    onClick,
    playSound = true,
    ...props
}: ClickableButtonProps) {
    const { playClickSound } = useSoundEffects()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (playSound) {
            playClickSound()
        }
        if (onClick) {
            onClick(event)
        }
    }

    return (
        <button {...props} onClick={handleClick}>
            {children}
        </button>
    )
}
