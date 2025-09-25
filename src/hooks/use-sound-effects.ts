'use client'

import { useCallback } from 'react'

// Global audio instances for sound effects
let clickAudio: HTMLAudioElement | null = null
let isInitialized = false

const initializeAudio = () => {
    if (typeof window === 'undefined' || isInitialized) return

    try {
        clickAudio = new Audio('/click.mp3')
        clickAudio.preload = 'auto'
        clickAudio.volume = 0.5 // Set moderate volume
        isInitialized = true
        console.log('Click sound initialized')
    } catch (error) {
        console.error('Failed to initialize click sound:', error)
    }
}

export const useSoundEffects = () => {
    const playClickSound = useCallback(() => {
        if (!isInitialized) {
            initializeAudio()
        }

        if (clickAudio) {
            // Reset audio to beginning and play
            clickAudio.currentTime = 0
            clickAudio.play().catch((error) => {
                console.warn('Click sound play failed:', error)
            })
        }
    }, [])

    return { playClickSound }
}

