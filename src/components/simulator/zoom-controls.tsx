"use client"

import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

interface ZoomControlsProps {
    zoom: number
    onZoomIn: () => void
    onZoomOut: () => void
    onFitView: () => void
}

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onFitView }: ZoomControlsProps) {
    const zoomPercentage = Math.round(zoom * 100)

    return (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-md p-1 z-20">
            <button onClick={onZoomOut} className="p-2 hover:bg-gray-100 rounded-md" title="Zoom Out">
                <ZoomOut size={18} />
            </button>

            <div className="px-2 min-w-[60px] text-center font-medium">{zoomPercentage}%</div>

            <button onClick={onZoomIn} className="p-2 hover:bg-gray-100 rounded-md" title="Zoom In">
                <ZoomIn size={18} />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1"></div>

            <button onClick={onFitView} className="p-2 hover:bg-gray-100 rounded-md" title="Fit View">
                <Maximize2 size={18} />
            </button>
        </div>
    )
}
