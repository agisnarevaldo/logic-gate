"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { Component, Position } from "@/types/simulator"
import { X, ToggleLeft, ToggleRight } from "lucide-react"

interface LogicGateComponentProps {
    component: Component
    onUpdatePosition: (position: Position) => void
    onStartConnection: (portId: string) => void
    onCompleteConnection: (portId: string) => void
    onRemove: () => void
    onToggleInput: () => void
}

export function LogicGateComponent({
                                       component,
                                       onUpdatePosition,
                                       onStartConnection,
                                       onCompleteConnection,
                                       onRemove,
                                       onToggleInput,
                                   }: LogicGateComponentProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
    const componentRef = useRef<HTMLDivElement>(null)

    // Start dragging the component
    const handleMouseDown = (e: React.MouseEvent) => {
        if (componentRef.current) {
            const rect = componentRef.current.getBoundingClientRect()
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            })
            setIsDragging(true)
        }
    }

    // Update component position while dragging
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && componentRef.current) {
            const parentRect = componentRef.current.parentElement?.getBoundingClientRect()
            if (parentRect) {
                const x = e.clientX - parentRect.left - dragOffset.x
                const y = e.clientY - parentRect.top - dragOffset.y
                onUpdatePosition({ x, y })
            }
        }
    }

    // Stop dragging
    const handleMouseUp = () => {
        setIsDragging(false)
    }

    // Render the appropriate component based on type
    const renderComponent = () => {
        switch (component.type) {
            case "INPUT":
                return (
                    <div className="flex items-center justify-center h-full">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onToggleInput()
                            }}
                            className="focus:outline-none"
                        >
                            {component.outputs[0]?.value ? (
                                <ToggleRight className="h-8 w-8 text-green-500" />
                            ) : (
                                <ToggleLeft className="h-8 w-8 text-gray-500" />
                            )}
                        </button>
                    </div>
                )
            case "OUTPUT":
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className={`w-8 h-8 rounded-full ${component.inputs[0]?.value ? "bg-green-500" : "bg-gray-300"}`} />
                    </div>
                )
            default:
                return (
                    <div className="flex items-center justify-center h-full">
                        <span className="font-bold">{component.type}</span>
                    </div>
                )
        }
    }

    return (
        <div
            ref={componentRef}
            className="absolute bg-white border-2 border-gray-300 rounded-md shadow-md cursor-move"
            style={{
                width: `${component.width}px`,
                height: `${component.height}px`,
                left: `${component.position.x}px`,
                top: `${component.position.y}px`,
                zIndex: isDragging ? 100 : 1,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Remove button */}
            <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 z-10"
                onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                }}
            >
                <X className="h-3 w-3" />
            </button>

            {/* Component content */}
            {renderComponent()}

            {/* Input ports */}
            {component.inputs.map((input, index) => {
                const portY = (component.height / (component.inputs.length + 1)) * (index + 1)
                return (
                    <div
                        key={input.id}
                        className={`absolute w-3 h-3 rounded-full border-2 cursor-pointer ${
                            input.value ? "bg-green-500 border-green-700" : "bg-gray-300 border-gray-500"
                        }`}
                        style={{
                            left: -5,
                            top: portY - 5,
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            onCompleteConnection(input.id)
                        }}
                    />
                )
            })}

            {/* Output ports */}
            {component.outputs.map((output, index) => {
                const portY = (component.height / (component.outputs.length + 1)) * (index + 1)
                return (
                    <div
                        key={output.id}
                        className={`absolute w-3 h-3 rounded-full border-2 cursor-pointer ${
                            output.value ? "bg-green-500 border-green-700" : "bg-gray-300 border-gray-500"
                        }`}
                        style={{
                            right: -5,
                            top: portY - 5,
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            onStartConnection(output.id)
                        }}
                    />
                )
            })}
        </div>
    )
}
