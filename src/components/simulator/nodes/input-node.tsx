"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps, useReactFlow } from "reactflow"
import { InputSwitchSymbol } from "@/components/quiz/logic-gate-symbols"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export const InputNode = memo(({ data, id }: NodeProps) => {
    const { deleteElements } = useReactFlow()
    const [isOn, setIsOn] = useState(data.value || false)
    
    const toggleValue = (e: React.MouseEvent) => {
        e.stopPropagation()
        const newValue = !isOn
        setIsOn(newValue)
        data.value = newValue
        // Force re-render by updating the data reference
        data.lastUpdate = Date.now()
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        deleteElements({ nodes: [{ id }] })
    }

    return (
        <div className="w-20 h-16 relative bg-white border-2 border-gray-300 rounded-lg shadow-md group">
            {/* Delete Button */}
            <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 w-5 h-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={handleDelete}
            >
                <X className="w-3 h-3" />
            </Button>

            {/* Input Switch Symbol - Clickable area */}
            <div 
                className="w-full h-full cursor-pointer select-none active:scale-95 transition-transform" 
                onClick={toggleValue}
                title="Klik untuk toggle switch"
            >
                <InputSwitchSymbol className="w-full h-full" isOn={isOn} />
            </div>

            {/* Output handle */}
            <Handle
                type="source"
                position={Position.Right}
                id="output"
                style={{ background: isOn ? "#22c55e" : "#9ca3af", width: "10px", height: "10px" }}
            />
        </div>
    )
})

InputNode.displayName = "InputNode"
