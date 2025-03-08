"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import type { Component, Connection, Position, DraggingWire, ComponentType } from "@/types/simulator"
import { LogicGateComponent } from "./logic-gate-component"
import { WireConnection } from "./wire-connection"

interface SimulatorCanvasProps {
    components: Component[]
    connections: Connection[]
    onUpdatePosition: (id: string, position: Position) => void
    onAddConnection: (fromComponentId: string, fromPortId: string, toComponentId: string, toPortId: string) => void
    onRemoveConnection: (id: string) => void
    onRemoveComponent: (id: string) => void
    onToggleInput: (id: string) => void
    onAddComponent: (type: ComponentType, position: Position) => string
}

export function SimulatorCanvas({
                                    components,
                                    connections,
                                    onUpdatePosition,
                                    onAddConnection,
                                    onRemoveConnection,
                                    onRemoveComponent,
                                    onToggleInput,
                                    onAddComponent,
                                }: SimulatorCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [draggingWire, setDraggingWire] = useState<DraggingWire | null>(null)
    const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 })

    // Throttle reference to limit mouse position updates
    const throttleRef = useRef<number | null>(null)

    // Handle dropping a component from the toolbar
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const componentType = e.dataTransfer.getData("componentType") as ComponentType

        if (componentType && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            onAddComponent(componentType, { x, y })
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    // Throttled mouse move handler
    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!canvasRef.current || !draggingWire) return

            // Throttle mouse position updates to 30fps (about 33ms)
            if (throttleRef.current !== null) return

            throttleRef.current = window.setTimeout(() => {
                throttleRef.current = null

                const rect = canvasRef.current?.getBoundingClientRect()
                if (rect) {
                    setMousePosition({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                    })
                }
            }, 33)
        },
        [draggingWire],
    )

    // Clean up throttle timer on unmount
    useEffect(() => {
        return () => {
            if (throttleRef.current !== null) {
                clearTimeout(throttleRef.current)
            }
        }
    }, [])

    // Start drawing a wire from an output port
    const handleStartConnection = (componentId: string, portId: string) => {
        setDraggingWire({
            fromComponent: componentId,
            fromPort: portId,
            toPosition: null,
        })
    }

    // Complete the connection to an input port
    const handleCompleteConnection = (componentId: string, portId: string) => {
        if (draggingWire) {
            onAddConnection(draggingWire.fromComponent, draggingWire.fromPort, componentId, portId)
            setDraggingWire(null)
        }
    }

    // Cancel wire drawing
    const handleCanvasClick = () => {
        if (draggingWire) {
            setDraggingWire(null)
        }
    }

    return (
        <div
            ref={canvasRef}
            className="w-full h-full bg-white relative overflow-auto"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            onClick={handleCanvasClick}
        >
            {/* Render all connections */}
            {connections.map((connection) => (
                <WireConnection
                    key={connection.id}
                    connection={connection}
                    components={components}
                    onRemove={() => onRemoveConnection(connection.id)}
                />
            ))}

            {/* Render the wire being drawn */}
            {draggingWire && (
                <DraggingWireComponent draggingWire={draggingWire} mousePosition={mousePosition} components={components} />
            )}

            {/* Render all components */}
            {components.map((component) => (
                <LogicGateComponent
                    key={component.id}
                    component={component}
                    onUpdatePosition={(position) => onUpdatePosition(component.id, position)}
                    onStartConnection={(portId) => handleStartConnection(component.id, portId)}
                    onCompleteConnection={(portId) => handleCompleteConnection(component.id, portId)}
                    onRemove={() => onRemoveComponent(component.id)}
                    onToggleInput={() => onToggleInput(component.id)}
                />
            ))}
        </div>
    )
}

// Component for the wire being drawn
function DraggingWireComponent({
                                   draggingWire,
                                   mousePosition,
                                   components,
                               }: {
    draggingWire: DraggingWire
    mousePosition: Position
    components: Component[]
}) {
    const fromComponent = components.find((c) => c.id === draggingWire.fromComponent)
    if (!fromComponent) return null

    const fromPort = fromComponent.outputs.find((p) => p.id === draggingWire.fromPort)
    if (!fromPort) return null

    // Calculate start position based on component position and port location
    const startX = fromComponent.position.x + fromComponent.width
    const startY = fromComponent.position.y + fromComponent.height / 2

    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
            <path
                d={`M ${startX} ${startY} C ${startX + 50} ${startY}, ${mousePosition.x - 50} ${mousePosition.y}, ${mousePosition.x} ${mousePosition.y}`}
                stroke="#000"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
            />
        </svg>
    )
}

