"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { OutputLampSymbol } from "@/components/quiz/logic-gate-symbols"

export const OutputNode = memo(({ data }: NodeProps) => {
    return (
        <div className="w-20 h-16 relative bg-white border-2 border-gray-300 rounded-lg shadow-md">
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
