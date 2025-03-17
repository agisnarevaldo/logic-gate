"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

export const GateNode = memo(({ data }: NodeProps) => {
    // Initialize input values if they don't exist
    if (!data.inputValues) {
        data.inputValues = [false, false]
    }

    return (
        <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
            <div className="flex items-center justify-center">
                <div className="text-sm font-bold">{data.gateType}</div>
            </div>

            {/* Input handles */}
            <Handle
                type="target"
                position={Position.Left}
                id="input-0"
                style={{
                    background: data.inputValues[0] ? "#22c55e" : "#9ca3af",
                    width: "8px",
                    height: "8px",
                    top: "30%",
                }}
            />

            <Handle
                type="target"
                position={Position.Left}
                id="input-1"
                style={{
                    background: data.inputValues[1] ? "#22c55e" : "#9ca3af",
                    width: "8px",
                    height: "8px",
                    top: "70%",
                }}
            />

            {/* Output handle */}
            <Handle
                type="source"
                position={Position.Right}
                id="output"
                style={{ background: data.value ? "#22c55e" : "#9ca3af", width: "8px", height: "8px" }}
            />
        </div>
    )
})

GateNode.displayName = "GateNode"
