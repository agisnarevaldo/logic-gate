"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps, useReactFlow } from "reactflow"
import { 
  AndGateSymbol, 
  OrGateSymbol, 
  NotGateSymbol, 
  NandGateSymbol, 
  NorGateSymbol, 
  XorGateSymbol, 
  XnorGateSymbol 
} from "@/components/quiz/logic-gate-symbols"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export const GateNode = memo(({ data, id }: NodeProps) => {
    const { deleteElements } = useReactFlow()
    
    // Initialize input values if they don't exist
    if (!data.inputValues) {
        data.inputValues = data.gateType === "NOT" ? [false] : [false, false]
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        deleteElements({ nodes: [{ id }] })
    }

    const renderGateSymbol = () => {
        const symbolProps = { className: "w-full h-full" }
        
        switch (data.gateType) {
            case "AND":
                return <AndGateSymbol {...symbolProps} />
            case "OR":
                return <OrGateSymbol {...symbolProps} />
            case "NOT":
                return <NotGateSymbol {...symbolProps} />
            case "NAND":
                return <NandGateSymbol {...symbolProps} />
            case "NOR":
                return <NorGateSymbol {...symbolProps} />
            case "XOR":
                return <XorGateSymbol {...symbolProps} />
            case "XNOR":
                return <XnorGateSymbol {...symbolProps} />
            default:
                return <div className="text-xs font-bold text-center">{data.gateType}</div>
        }
    }

    const isNotGate = data.gateType === "NOT"

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

            {/* Gate Symbol */}
            <div className="w-full h-full p-1">
                {renderGateSymbol()}
            </div>

            {/* Input handles */}
            {isNotGate ? (
                <Handle
                    type="target"
                    position={Position.Left}
                    id="input-0"
                    style={{
                        background: data.inputValues[0] ? "#22c55e" : "#9ca3af",
                        width: "10px",
                        height: "10px",
                        top: "50%",
                    }}
                />
            ) : (
                <>
                    <Handle
                        type="target"
                        position={Position.Left}
                        id="input-0"
                        style={{
                            background: data.inputValues[0] ? "#22c55e" : "#9ca3af",
                            width: "10px",
                            height: "10px",
                            top: "30%",
                        }}
                    />
                    <Handle
                        type="target"
                        position={Position.Left}
                        id="input-1"
                        style={{
                            background: data.inputValues[1] ? "#22c55e" : "#9ca3af",
                            width: "10px",
                            height: "10px",
                            top: "70%",
                        }}
                    />
                </>
            )}

            {/* Output handle */}
            <Handle
                type="source"
                position={Position.Right}
                id="output"
                style={{ 
                    background: data.value ? "#22c55e" : "#9ca3af", 
                    width: "10px", 
                    height: "10px" 
                }}
            />
        </div>
    )
})

GateNode.displayName = "GateNode"
