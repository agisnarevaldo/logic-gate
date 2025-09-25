"use client"

import { useSoundEffects } from "@/hooks/use-sound-effects"
import { ReactNode, useEffect } from "react"

interface SoundEffectsProviderProps {
    children: ReactNode
}

export function SoundEffectsProvider({ children }: SoundEffectsProviderProps) {
    const { playClickSound } = useSoundEffects()

    useEffect(() => {
        const handleClick = (event: Event) => {
            const target = event.target as HTMLElement

            // Check if the clicked element is a button, link, or interactive element
            if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.role === 'button' ||
                target.getAttribute('tabindex') === '0' ||
                target.closest('button') ||
                target.closest('a') ||
                target.closest('[role="button"]') ||
                target.closest('[data-clickable="true"]')
            ) {
                // Check if sound is explicitly disabled for this element
                const soundDisabled = target.getAttribute('data-no-sound') === 'true' ||
                    target.closest('[data-no-sound="true"]')

                if (!soundDisabled) {
                    playClickSound()
                }
            }
        }

        // Add global click listener
        document.addEventListener('click', handleClick, true)

        return () => {
            document.removeEventListener('click', handleClick, true)
        }
    }, [playClickSound])

    return <>{children}</>
}
