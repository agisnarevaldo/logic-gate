'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { GuessGameImage } from '@/types/guess-game'

interface GameImageCardProps {
  image: GuessGameImage
  isSelected: boolean
  onSelect: (id: string) => void
  showResult?: boolean
  disabled?: boolean
}

export function GameImageCard({ 
  image, 
  isSelected, 
  onSelect, 
  showResult = false,
  disabled = false 
}: GameImageCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const getImagePath = () => {
    const folder = image.isCorrect ? 'correct' : 'distractors'
    return `/images/guess-game/${folder}/${image.filename}`
  }

  const getCardStyle = () => {
    if (disabled) return 'opacity-50 cursor-not-allowed'
    
    if (!showResult) {
      return cn(
        'cursor-pointer transition-all duration-200 hover:scale-105',
        isSelected 
          ? 'ring-4 ring-blue-500 bg-blue-50 shadow-lg' 
          : 'hover:ring-2 hover:ring-gray-300 hover:shadow-md'
      )
    }
    
    // Show results
    if (isSelected && image.isCorrect) {
      return 'ring-4 ring-green-500 bg-green-50 shadow-lg'
    }
    if (isSelected && !image.isCorrect) {
      return 'ring-4 ring-red-500 bg-red-50 shadow-lg'
    }
    if (!isSelected && image.isCorrect) {
      return 'ring-2 ring-yellow-400 bg-yellow-50'
    }
    return 'opacity-60'
  }

  const getOverlayIcon = () => {
    if (!showResult) return null
    
    if (isSelected && image.isCorrect) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
          <div className="bg-green-500 text-white rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )
    }
    
    if (isSelected && !image.isCorrect) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
          <div className="bg-red-500 text-white rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      )
    }
    
    if (!isSelected && image.isCorrect) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-yellow-500/20">
          <div className="bg-yellow-500 text-white rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
      )
    }
    
    return null
  }

  const handleClick = () => {
    if (!disabled && !showResult) {
      onSelect(image.id)
    }
  }

  return (
    <div 
      className={cn(
        'relative aspect-square rounded-lg border-2 border-gray-200 overflow-hidden',
        getCardStyle()
      )}
      onClick={handleClick}
    >
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      {/* Error placeholder */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Image not found</span>
          </div>
        </div>
      )}
      
      {/* Main image */}
      <Image
        src={getImagePath()}
        alt={`Game image ${image.id}`}
        fill
        className={cn(
          'object-cover transition-opacity duration-200',
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true)
          setImageLoaded(true)
        }}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
      
      {/* Selection indicator */}
      {isSelected && !showResult && (
        <div className="absolute top-2 right-2">
          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
            ✓
          </div>
        </div>
      )}
      
      {/* Result overlay */}
      {getOverlayIcon()}
    </div>
  )
}
