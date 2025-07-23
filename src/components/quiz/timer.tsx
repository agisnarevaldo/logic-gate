'use client'

import { useEffect, useState } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimerProps {
  timeRemaining: number // in seconds
  isWarning?: boolean
  className?: string
}

export const Timer = ({ 
  timeRemaining, 
  isWarning = false,
  className 
}: TimerProps) => {
  const [isBlinking, setIsBlinking] = useState(false)

  // Format time to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Blink effect for warning
  useEffect(() => {
    if (isWarning && timeRemaining <= 60) { // Last minute
      const interval = setInterval(() => {
        setIsBlinking(prev => !prev)
      }, 500)
      return () => clearInterval(interval)
    } else {
      setIsBlinking(false)
    }
  }, [isWarning, timeRemaining])

  const getTimeColor = () => {
    if (timeRemaining <= 60) return 'text-red-600' // Last minute
    if (timeRemaining <= 300) return 'text-orange-600' // Last 5 minutes
    return 'text-gray-700'
  }

  const getBackgroundColor = () => {
    if (timeRemaining <= 60) return 'bg-red-50 border-red-200'
    if (timeRemaining <= 300) return 'bg-orange-50 border-orange-200'
    return 'bg-gray-50 border-gray-200'
  }

  return (
    <div className={cn(
      "flex items-center space-x-2 px-3 py-2 border rounded-lg transition-all",
      getBackgroundColor(),
      isBlinking && "animate-pulse",
      className
    )}>
      {timeRemaining <= 300 ? (
        <AlertTriangle className={cn("h-4 w-4", getTimeColor())} />
      ) : (
        <Clock className={cn("h-4 w-4", getTimeColor())} />
      )}
      <span className={cn(
        "font-mono font-medium text-sm",
        getTimeColor()
      )}>
        {formatTime(timeRemaining)}
      </span>
      {timeRemaining <= 300 && (
        <span className="text-xs text-gray-500">tersisa</span>
      )}
    </div>
  )
}
