"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { ToggleLeft, ToggleRight } from "lucide-react"

export const InputNode = memo(({ data, id }: NodeProps) => {
    const toggleValue = () => {
        data.value = !data.value
    }

    return (
        <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
            <div className="flex items-center">
                <div className="ml-2">
                    <div className="text-xs font-bold">Input</div>
                    <button onClick={toggleValue} className="focus:outline-none touch-manipulation">
                        {data.value ? (
                            <ToggleRight className="h-7 w-7 text-green-500" />
                        ) : (
                            <ToggleLeft className="h-7 w-7 text-gray-500" />
                        )}
                    </button>
                </div>
            </div>

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

InputNode.displayName = "InputNode"
