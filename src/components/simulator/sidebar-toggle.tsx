"use client"

import { Button } from "@/components/ui/button"
import { Plus, Trash2, Download } from "lucide-react"
import { useReactFlow, getNodesBounds, getViewportForBounds } from "reactflow"
import { toPng } from "html-to-image"
import { useCallback } from "react"

interface SidebarToggleProps {
  onClick: () => void
  onClear?: () => void
  className?: string
}

function downloadImage(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.setAttribute('download', filename)
  a.setAttribute('href', dataUrl)
  a.click()
}

// Internal component that uses ReactFlow context
export function SidebarToggleInternal({ onClick, onClear, className = "" }: SidebarToggleProps) {
  const { getNodes } = useReactFlow()

  const onDownload = useCallback(() => {
    const nodes = getNodes()
    
    if (nodes.length === 0) {
      console.warn('No nodes to download')
      return
    }

    const imageWidth = 1024
    const imageHeight = 768

    // Calculate transform for all nodes to be visible
    const nodesBounds = getNodesBounds(nodes)
    const { x, y, zoom } = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
    )

    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement
    
    if (!viewport) {
      console.error('React Flow viewport not found')
      return
    }

    // Get current date for filename
    const now = new Date()
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `logic-gate-simulator-${timestamp}.png`

    toPng(viewport, {
      backgroundColor: '#ffffff',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${x}px, ${y}px) scale(${zoom})`,
      },
    }).then((dataUrl) => {
      downloadImage(dataUrl, filename)
    }).catch((error) => {
      console.error('Error generating image:', error)
    })
  }, [getNodes])

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className={`bg-white shadow-lg hover:bg-gray-50 ${className}`}
      >
        <Plus className="w-5 h-5" />
        <span className="ml-2 sm:inline">Komponen</span>
      </Button>
      
      {onClear && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="bg-white shadow-lg hover:bg-gray-50 text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" />
          <span className="ml-2 sm:inline">Clear</span>
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onDownload}
        className="bg-white shadow-lg hover:bg-gray-50"
        title="Download circuit as PNG"
      >
        <Download className="w-4 h-4" />
        <span className="ml-2 sm:inline">Download</span>
      </Button>
    </div>
  )
}

// External component placeholder (not used but kept for consistency)
export function SidebarToggle({ onClick, onClear, className = "" }: SidebarToggleProps) {
  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className={`bg-white shadow-lg hover:bg-gray-50 ${className}`}
      >
        <Plus className="w-5 h-5" />
        <span className="ml-2 sm:inline">Komponen</span>
      </Button>
      
      {onClear && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="bg-white shadow-lg hover:bg-gray-50 text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" />
          <span className="ml-2 sm:inline">Clear</span>
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        className="bg-white shadow-lg hover:bg-gray-50"
        disabled
        title="Download not available"
      >
        <Download className="w-4 h-4" />
        <span className="ml-2 sm:inline">Download</span>
      </Button>
    </div>
  )
}
