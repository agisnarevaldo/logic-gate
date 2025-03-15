"use client"

import type { Connection, Component } from "@/types/simulator"

interface WireConnectionProps {
    connection: Connection
    components: Component[]
    onRemove: () => void
}

export function WireConnection({ connection, components, onRemove }: WireConnectionProps) {
    const fromComponent = components.find((c) => c.id === connection.from.componentId)
    const toComponent = components.find((c) => c.id === connection.to.componentId)

    if (!fromComponent || !toComponent) return null

    const fromPort = fromComponent.outputs.find((p) => p.id === connection.from.portId)
    const toPort = toComponent.inputs.find((p) => p.id === connection.to.portId)

    if (!fromPort || !toPort) return null

    // Calculate port positions
    const fromPortIndex = fromComponent.outputs.findIndex((p) => p.id === connection.from.portId)
    const toPortIndex = toComponent.inputs.findIndex((p) => p.id === connection.to.portId)

    const fromPortY =
        fromComponent.position.y + (fromComponent.height / (fromComponent.outputs.length + 1)) * (fromPortIndex + 1)

    const toPortY = toComponent.position.y + (toComponent.height / (toComponent.inputs.length + 1)) * (toPortIndex + 1)

    const fromX = fromComponent.position.x + fromComponent.width
    const fromY = fromPortY
    const toX = toComponent.position.x
    const toY = toPortY

    // Create a bezier curve path
    const controlPointOffset = Math.min(100, Math.abs(toX - fromX) / 2)
    const path = `M ${fromX} ${fromY} C ${fromX + controlPointOffset} ${fromY}, ${toX - controlPointOffset} ${toY}, ${toX} ${toY}`

    // Determine wire color based on signal value
    const wireColor = fromPort.value ? "#22c55e" : "#9ca3af"

    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <path
                d={path}
                stroke={wireColor}
                strokeWidth="2"
                fill="none"
                className="pointer-events-auto"
                onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                }}
            />
            {/* Add a wider invisible path for easier clicking */}
            <path
                d={path}
                stroke="transparent"
                strokeWidth="10"
                fill="none"
                className="pointer-events-auto cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                }}
            />
        </svg>
    )
}
