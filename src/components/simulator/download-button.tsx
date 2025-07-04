"use client"

import React, { useCallback } from "react"
import { useReactFlow, getNodesBounds, getViewportForBounds } from "reactflow"
import { toPng } from "html-to-image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DownloadButtonProps {
  className?: string
}

function downloadImage(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.setAttribute('download', filename)
  a.setAttribute('href', dataUrl)
  a.click()
}

const imageWidth = 1024
const imageHeight = 768

// Internal component that uses ReactFlow context
function DownloadButtonInternal({ className }: DownloadButtonProps) {
  const { getNodes } = useReactFlow()

  const onClick = useCallback(() => {
    const nodes = getNodes()
    
    if (nodes.length === 0) {
      console.warn('No nodes to download')
      return
    }

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
    <Button
      onClick={onClick}
      size="sm"
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
      title="Download circuit as PNG"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Download</span>
    </Button>
  )
}

// External component that will be used outside ReactFlow context
export function DownloadButton({ className }: DownloadButtonProps) {
  // This is just a placeholder that will be replaced by the internal component
  // when used within ReactFlow context
  return (
    <Button
      size="sm"
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
      disabled
      title="Download not available"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Download</span>
    </Button>
  )
}

// Export the internal component to be used within ReactFlow
export { DownloadButtonInternal }
