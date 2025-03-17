"use client"

import { memo } from "react"
import { type EdgeProps, getBezierPath } from "reactflow"

export const CustomEdge = memo(
    ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) => {
        const [edgePath] = getBezierPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
        })

        // Determine wire color based on signal value
        const wireColor = data?.value ? "#22c55e" : "#9ca3af"

        return (
            <g>
                <path id={id} className="react-flow__edge-path" d={edgePath} strokeWidth={2} stroke={wireColor} />
            </g>
        )
    },
)

CustomEdge.displayName = "CustomEdge"
