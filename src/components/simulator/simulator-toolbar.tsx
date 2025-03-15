"use client"

import type React from "react"

import type { ComponentType } from "@/types/simulator"
import { Button } from "@/components/ui/button"
import { ToggleLeft, Circle, AmpersandIcon as And, OrbitIcon as Or, X, AlertTriangle, XCircle } from "lucide-react"

interface SimulatorToolbarProps {
    onAddComponent: (type: ComponentType, position: { x: number; y: number }) => string
}

export function SimulatorToolbar({ onAddComponent }: SimulatorToolbarProps) {
    const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
        e.dataTransfer.setData("componentType", type)
    }

    const components: { type: ComponentType; icon: React.ReactNode; label: string }[] = [
        { type: "INPUT", icon: <ToggleLeft className="h-5 w-5" />, label: "Input" },
        { type: "OUTPUT", icon: <Circle className="h-5 w-5" />, label: "Output" },
        { type: "AND", icon: <And className="h-5 w-5" />, label: "AND" },
        { type: "OR", icon: <Or className="h-5 w-5" />, label: "OR" },
        { type: "NOT", icon: <AlertTriangle className="h-5 w-5" />, label: "NOT" },
        { type: "NAND", icon: <And className="h-5 w-5" />, label: "NAND" },
        { type: "NOR", icon: <Or className="h-5 w-5" />, label: "NOR" },
        { type: "XOR", icon: <X className="h-5 w-5" />, label: "XOR" },
        { type: "XNOR", icon: <XCircle className="h-5 w-5" />, label: "XNOR" },
    ]

    return (
        <div className="flex flex-wrap gap-2">
            <div className="w-full mb-2">
                <h3 className="text-lg font-medium">Drag components to the canvas</h3>
            </div>
            {components.map((component) => (
                <div
                    key={component.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component.type)}
                    className="cursor-grab"
                >
                    <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-20 w-20 p-2 gap-1 bg-white hover:bg-gray-50"
                    >
                        {component.icon}
                        <span className="text-xs">{component.label}</span>
                    </Button>
                </div>
            ))}
        </div>
    )
}
