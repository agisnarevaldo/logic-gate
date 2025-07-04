"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps, useReactFlow } from "reactflow"
import { OutputLampSymbol } from "@/components/quiz/logic-gate-symbols"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export const OutputNode = memo(({ data, id }: NodeProps) => {
    const { deleteElements } = useReactFlow()

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        deleteElements({ nodes: [{ id }] })
    }

    return (
        <div className="w-20 h-16 relative bg-white border-2 border-gray-300 rounded-lg shadow-md group">
            {/* Delete Button - Always visible on mobile, hover on desktop */}
            <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 w-5 h-5 p-0 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                onClick={handleDelete}
            >
                <X className="w-3 h-3" />
            </Button>

            {/* Output Lamp Symbol */}
            <div className="w-full h-full">
                <OutputLampSymbol className="w-full h-full" isOn={data.value} />
            </div>

            {/* Input handle */}
            <Handle
                type="target"
                position={Position.Left}
                id="input"
                style={{ background: data.value ? "#22c55e" : "#9ca3af", width: "10px", height: "10px" }}
            />
        </div>
    )
})

OutputNode.displayName = "OutputNode"
