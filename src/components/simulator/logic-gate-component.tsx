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
    zoom?: number
}

export function LogicGateComponent({
                                       component,
                                       onUpdatePosition,
                                       onStartConnection,
                                       onCompleteConnection,
                                       onRemove,
                                       onToggleInput,
                                       zoom = 1,
                                   }: LogicGateComponentProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
    const componentRef = useRef<HTMLDivElement>(null)
    const touchStartRef = useRef<Position | null>(null)

    // Start dragging the component (mouse)
    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (componentRef.current) {
            const rect = componentRef.current.getBoundingClientRect()
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            })
            setIsDragging(true)
        }
    }

    // Update component position while dragging (mouse)
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && componentRef.current) {
            const parentRect = componentRef.current.parentElement?.getBoundingClientRect()
            if (parentRect) {
                // Adjust for zoom
                const x = (e.clientX - parentRect.left - dragOffset.x) / zoom
                const y = (e.clientY - parentRect.top - dragOffset.y) / zoom
                onUpdatePosition({ x, y })
            }
        }
    }

    // Stop dragging (mouse)
    const handleMouseUp = () => {
        setIsDragging(false)
    }

    // Touch handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation()
        if (componentRef.current) {
            const rect = componentRef.current.getBoundingClientRect()
            const touch = e.touches[0]

            setDragOffset({
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            })

            touchStartRef.current = {
                x: touch.clientX,
                y: touch.clientY,
            }

            setIsDragging(true)
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isDragging && componentRef.current) {
            e.stopPropagation()
            const parentRect = componentRef.current.parentElement?.getBoundingClientRect()
            if (parentRect) {
                const touch = e.touches[0]

                // Adjust for zoom
                const x = (touch.clientX - parentRect.left - dragOffset.x) / zoom
                const y = (touch.clientY - parentRect.top - dragOffset.y) / zoom
                onUpdatePosition({ x, y })
            }
        }
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        // Check if this was a tap (not a drag)
        if (touchStartRef.current && componentRef.current) {
            const touch = e.changedTouches[0]
            const dx = touch.clientX - touchStartRef.current.x
            const dy = touch.clientY - touchStartRef.current.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            // If the touch didn't move much, consider it a tap
            if (distance < 10 && component.type === "INPUT") {
                onToggleInput()
            }
        }

        touchStartRef.current = null
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
                            className="focus:outline-none touch-manipulation"
                        >
                            {component.outputs[0]?.value ? (
                                <ToggleRight className="h-7 w-7 md:h-8 md:w-8 text-green-500" />
                            ) : (
                                <ToggleLeft className="h-7 w-7 md:h-8 md:w-8 text-gray-500" />
                            )}
                        </button>
                    </div>
                )
            case "OUTPUT":
                return (
                    <div className="flex items-center justify-center h-full">
                        <div
                            className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${component.inputs[0]?.value ? "bg-green-500" : "bg-gray-300"}`}
                        />
                    </div>
                )
            default:
                return (
                    <div className="flex items-center justify-center h-full">
                        <span className="font-bold text-sm md:text-base">{component.type}</span>
                    </div>
                )
        }
    }

    // Calculate port sizes based on screen size
    const portSize = 3
    const portOffset = 5

    return (
        <div
            ref={componentRef}
            className="absolute bg-white border-2 border-gray-300 rounded-md shadow-md cursor-move touch-manipulation"
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Remove button */}
            <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 z-10 touch-manipulation"
                style={{ width: "18px", height: "18px" }}
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
                        className={`absolute w-${portSize} h-${portSize} rounded-full border-2 cursor-pointer touch-manipulation ${
                            input.value ? "bg-green-500 border-green-700" : "bg-gray-300 border-gray-500"
                        }`}
                        style={{
                            left: -portOffset,
                            top: portY - portOffset,
                            width: `${portSize * 2}px`,
                            height: `${portSize * 2}px`,
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
                        className={`absolute w-${portSize} h-${portSize} rounded-full border-2 cursor-pointer touch-manipulation ${
                            output.value ? "bg-green-500 border-green-700" : "bg-gray-300 border-gray-500"
                        }`}
                        style={{
                            right: -portOffset,
                            top: portY - portOffset,
                            width: `${portSize * 2}px`,
                            height: `${portSize * 2}px`,
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
