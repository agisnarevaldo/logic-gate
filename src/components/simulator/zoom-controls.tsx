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
        <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 flex items-center gap-1 md:gap-2 bg-white border border-gray-200 rounded-lg shadow-md p-1 z-20">
            <button
                onClick={onZoomOut}
                className="p-1 md:p-2 hover:bg-gray-100 rounded-md touch-manipulation"
                title="Zoom Out"
            >
                <ZoomOut size={16} className="md:size-18" />
            </button>

            <div className="px-1 md:px-2 min-w-[50px] md:min-w-[60px] text-center text-sm md:text-base font-medium">
                {zoomPercentage}%
            </div>

            <button onClick={onZoomIn} className="p-1 md:p-2 hover:bg-gray-100 rounded-md touch-manipulation" title="Zoom In">
                <ZoomIn size={16} className="md:size-18" />
            </button>

            <div className="w-px h-5 md:h-6 bg-gray-200 mx-0.5 md:mx-1"></div>

            <button
                onClick={onFitView}
                className="p-1 md:p-2 hover:bg-gray-100 rounded-md touch-manipulation"
                title="Fit View"
            >
                <Maximize2 size={16} className="md:size-18" />
            </button>
        </div>
    )
}
