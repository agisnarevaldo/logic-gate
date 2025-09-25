'use client'

import { useState, useEffect } from 'react'

interface MusicState {
  isPlaying: boolean
  volume: number
  isMuted: boolean
}

// Simple global audio management
let globalAudio: HTMLAudioElement | null = null
let isInitialized = false

const initializeAudio = () => {
  if (typeof window === 'undefined' || isInitialized) return

  globalAudio = new Audio('/bgm.mp3')
  globalAudio.loop = true
  globalAudio.volume = 0.3
  globalAudio.preload = 'auto'
  isInitialized = true

  console.log('Audio initialized')

  // Try auto-play after user interaction
  const tryAutoPlay = () => {
    if (globalAudio) {
      globalAudio.play()
        .then(() => console.log('Auto-play successful'))
        .catch(() => console.log('Auto-play failed, waiting for user interaction'))
    }
    document.removeEventListener('click', tryAutoPlay)
  }
  document.addEventListener('click', tryAutoPlay)
}

export const useBackgroundMusic = () => {
  const [musicState, setMusicState] = useState<MusicState>({
    isPlaying: false,
    volume: 0.3,
    isMuted: false
  })

  // Initialize audio on first hook usage
  useEffect(() => {
    initializeAudio()

    // Load preferences
    const saved = localStorage.getItem('music-preferences')
    if (saved) {
      try {
        const prefs = JSON.parse(saved)
        setMusicState(prev => ({ ...prev, ...prefs }))
        if (globalAudio) {
          globalAudio.volume = prefs.isMuted ? 0 : prefs.volume
        }
      } catch (error) {
        console.error('Error loading preferences:', error)
      }
    }

    // Set up interval to check playing status
    const interval = setInterval(() => {
      if (globalAudio) {
        setMusicState(prev => ({
          ...prev,
          isPlaying: !globalAudio!.paused
        }))
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Save preferences when state changes
  useEffect(() => {
    localStorage.setItem('music-preferences', JSON.stringify({
      volume: musicState.volume,
      isMuted: musicState.isMuted
    }))
  }, [musicState.volume, musicState.isMuted])

  const toggleMusic = () => {
    if (!globalAudio) {
      console.log('Audio not initialized')
      return
    }

    if (globalAudio.paused) {
      console.log('Playing music')
      globalAudio.play().catch(console.error)
    } else {
      console.log('Pausing music')
      globalAudio.pause()
    }
  }

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setMusicState(prev => ({ ...prev, volume: clampedVolume }))

    if (globalAudio && !musicState.isMuted) {
      globalAudio.volume = clampedVolume
    }
  }

  const toggleMute = () => {
    const newMuted = !musicState.isMuted
    setMusicState(prev => ({ ...prev, isMuted: newMuted }))

    if (globalAudio) {
      globalAudio.volume = newMuted ? 0 : musicState.volume
    }
  }

  return {
    musicState,
    toggleMusic,
    setVolume,
    toggleMute
  }
}