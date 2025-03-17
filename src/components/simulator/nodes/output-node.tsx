"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

export const OutputNode = memo(({ data }: NodeProps) => {
    return (
        <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
            <div className="flex items-center">
                <div className="ml-2">
                    <div className="text-xs font-bold">Output</div>
                    <div className={`w-7 h-7 rounded-full ${data.value ? "bg-green-500" : "bg-gray-300"}`} />
                </div>
            </div>

            {/* Input handle */}
            <Handle
                type="target"
                position={Position.Left}
                id="input"
                style={{ background: data.value ? "#22c55e" : "#9ca3af", width: "8px", height: "8px" }}
            />
        </div>
    )
})

OutputNode.displayName = "OutputNode"
