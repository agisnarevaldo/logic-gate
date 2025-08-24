'use client'

import React from 'react'
import { GuessGameImage } from '@/types/guess-game'
import { GameImageCard } from './game-image-card'
import { cn } from '@/lib/utils'

interface GuessGameGridProps {
  images: GuessGameImage[]
  selectedImages: string[]
  onImageSelect: (imageId: string) => void
  showResult?: boolean
  disabled?: boolean
  maxSelections?: number
}

export function GuessGameGrid({
  images,
  selectedImages,
  onImageSelect,
  showResult = false,
  disabled = false,
  maxSelections
}: GuessGameGridProps) {
  const gridSize = images.length
  
  // Determine grid layout based on number of images
  const getGridCols = () => {
    if (gridSize <= 4) return 'grid-cols-2'
    if (gridSize <= 9) return 'grid-cols-3'
    if (gridSize <= 12) return 'grid-cols-3 sm:grid-cols-4'
    return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5'
  }

  const handleImageSelect = (imageId: string) => {
    if (disabled) return
    
    const isSelected = selectedImages.includes(imageId)
    const canSelect = !maxSelections || selectedImages.length < maxSelections || isSelected
    
    if (canSelect) {
      onImageSelect(imageId)
    }
  }

  return (
    <div className="w-full">
      {/* Selection status */}
      {maxSelections && !showResult && (
        <div className="mb-4 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            Dipilih: {selectedImages.length}/{maxSelections}
          </div>
          {selectedImages.length >= maxSelections && (
            <div className="mt-2 text-xs text-amber-600">
              Batas maksimal tercapai. Hapus pilihan untuk memilih yang lain.
            </div>
          )}
        </div>
      )}

      {/* Image grid */}
      <div className={cn(
        'grid gap-3 sm:gap-4 w-full',
        getGridCols()
      )}>
        {images.map((image) => (
          <GameImageCard
            key={image.id}
            image={image}
            isSelected={selectedImages.includes(image.id)}
            onSelect={handleImageSelect}
            showResult={showResult}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Result summary */}
      {showResult && (
        <div className="mt-6 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-green-800 font-semibold">Benar</div>
              <div className="text-2xl font-bold text-green-600">
                {selectedImages.filter(id => 
                  images.find(img => img.id === id)?.isCorrect
                ).length}
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-red-800 font-semibold">Salah</div>
              <div className="text-2xl font-bold text-red-600">
                {selectedImages.filter(id => 
                  !images.find(img => img.id === id)?.isCorrect
                ).length}
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-yellow-800 font-semibold">Terlewat</div>
              <div className="text-2xl font-bold text-yellow-600">
                {images.filter(img => 
                  img.isCorrect && !selectedImages.includes(img.id)
                ).length}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="text-xs text-gray-600 text-center space-y-1">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Benar dipilih</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Salah dipilih</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Benar terlewat</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
