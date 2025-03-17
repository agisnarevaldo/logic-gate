"use client"

import { Button } from "@/components/ui/button"
import { Play, Save, Trash2, Download, Upload } from "lucide-react"

interface SimulatorControlsProps {
    onSimulate: () => void
    onClear?: () => void
    onSave?: () => void
    onLoad?: () => void
    onExport?: () => void
}

export function SimulatorControls({ onSimulate, onClear, onSave, onLoad, onExport }: SimulatorControlsProps) {
    return (
        <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={onSimulate} className="bg-green-600 hover:bg-green-700 h-10 px-3 md:px-4 touch-manipulation">
                <Play className="mr-1 md:mr-2 h-4 w-4" />
                <span className="text-sm md:text-base">Simulate</span>
            </Button>

            {onClear && (
                <Button variant="outline" onClick={onClear} className="h-10 px-3 md:px-4 touch-manipulation">
                    <Trash2 className="mr-1 md:mr-2 h-4 w-4" />
                    <span className="text-sm md:text-base">Clear</span>
                </Button>
            )}

            {onSave && (
                <Button variant="outline" onClick={onSave} className="h-10 px-3 md:px-4 touch-manipulation">
                    <Save className="mr-1 md:mr-2 h-4 w-4" />
                    <span className="text-sm md:text-base">Save</span>
                </Button>
            )}

            {onLoad && (
                <Button variant="outline" onClick={onLoad} className="h-10 px-3 md:px-4 touch-manipulation">
                    <Upload className="mr-1 md:mr-2 h-4 w-4" />
                    <span className="text-sm md:text-base">Load</span>
                </Button>
            )}

            {onExport && (
                <Button variant="outline" onClick={onExport} className="h-10 px-3 md:px-4 touch-manipulation">
                    <Download className="mr-1 md:mr-2 h-4 w-4" />
                    <span className="text-sm md:text-base">Export</span>
                </Button>
            )}
        </div>
    )
}
