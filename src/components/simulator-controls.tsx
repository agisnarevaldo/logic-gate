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
        <div className="flex gap-2 justify-center">
            <Button onClick={onSimulate} className="bg-green-600 hover:bg-green-700">
                <Play className="mr-2 h-4 w-4" />
                Simulate
            </Button>

            {onClear && (
                <Button variant="outline" onClick={onClear}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            )}

            {onSave && (
                <Button variant="outline" onClick={onSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                </Button>
            )}

            {onLoad && (
                <Button variant="outline" onClick={onLoad}>
                    <Upload className="mr-2 h-4 w-4" />
                    Load
                </Button>
            )}

            {onExport && (
                <Button variant="outline" onClick={onExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            )}
        </div>
    )
}
