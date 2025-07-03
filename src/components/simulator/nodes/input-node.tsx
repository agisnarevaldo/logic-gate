"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { InputSwitchSymbol } from "@/components/quiz/logic-gate-symbols"

export const InputNode = memo(({ data }: NodeProps) => {
    const toggleValue = () => {
        data.value = !data.value
    }

    return (
        <div className="w-20 h-16 relative bg-white border-2 border-gray-300 rounded-lg shadow-md cursor-pointer" onClick={toggleValue}>
            {/* Input Switch Symbol */}
            <div className="w-full h-full">
                <InputSwitchSymbol className="w-full h-full" isOn={data.value} />
            </div>

            {/* Output handle */}
            <Handle
                type="source"
                position={Position.Right}
                id="output"
                style={{ background: data.value ? "#22c55e" : "#9ca3af", width: "10px", height: "10px" }}
            />
        </div>
    )
})

InputNode.displayName = "InputNode"
