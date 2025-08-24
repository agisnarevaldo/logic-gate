'use client'

import React from 'react'
import { ChallengeComponent as ChallengeComponentType } from '@/types/challenge'

interface ChallengeConnectionProps {
  connection: {
    fromComponent: string
    fromPort: string
    toComponent: string
    toPort: string
  }
  components: ChallengeComponentType[]
  value?: boolean
}

export const ChallengeConnection: React.FC<ChallengeConnectionProps> = ({
  connection,
  components,
  value = false
}) => {
  // Find source and target components
  const sourceComponent = components.find(c => c.id === connection.fromComponent)
  const targetComponent = components.find(c => c.id === connection.toComponent)

  if (!sourceComponent || !targetComponent) return null

  // Calculate port positions
  const getPortPosition = (component: ChallengeComponentType, portId: string, isOutput: boolean) => {
    const portOffset = 6
    const ports = isOutput ? component.outputs : component.inputs
    const portIndex = ports.findIndex(p => p.id === portId)
    
    if (portIndex === -1) return null

    // Special handling for NOT gate input position
    let portY: number
    if (component.type === 'NOT' && !isOutput) {
      portY = component.height / 2
    } else {
      portY = (component.height / (ports.length + 1)) * (portIndex + 1)
    }
    
    return {
      x: component.position.x + (isOutput ? component.width + portOffset : -portOffset),
      y: component.position.y + portY
    }
  }

  const startPos = getPortPosition(sourceComponent, connection.fromPort, true)
  const endPos = getPortPosition(targetComponent, connection.toPort, false)

  if (!startPos || !endPos) return null

  // Calculate smooth curved path for the wire
  const midX = (startPos.x + endPos.x) / 2
  const path = `M ${startPos.x} ${startPos.y} C ${midX} ${startPos.y}, ${midX} ${endPos.y}, ${endPos.x} ${endPos.y}`

  // Wire color and glow effect based on signal value
  const wireColor = value ? '#10b981' : '#6b7280'
  const glowColor = value ? '#34d399' : 'transparent'

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Glow effect for active wires */}
      {value && (
        <path
          d={path}
          stroke={glowColor}
          strokeWidth="6"
          fill="none"
          opacity="0.4"
          className="transition-all duration-300"
        />
      )}
      
      {/* Main wire */}
      <path
        d={path}
        stroke={wireColor}
        strokeWidth={value ? "3" : "2"}
        fill="none"
        className="transition-all duration-300"
      />
      
      {/* Connection dots */}
      <circle
        cx={startPos.x}
        cy={startPos.y}
        r={value ? "4" : "3"}
        fill={wireColor}
        className="transition-all duration-300"
      />
      <circle
        cx={endPos.x}
        cy={endPos.y}
        r={value ? "4" : "3"}
        fill={wireColor}
        className="transition-all duration-300"
      />
      
      {/* Animated pulse effect for active signals */}
      {value && (
        <>
          <circle
            cx={startPos.x}
            cy={startPos.y}
            r="4"
            fill="none"
            stroke={glowColor}
            strokeWidth="2"
            opacity="0.6"
          >
            <animate
              attributeName="r"
              values="4;8;4"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx={endPos.x}
            cy={endPos.y}
            r="4"
            fill="none"
            stroke={glowColor}
            strokeWidth="2"
            opacity="0.6"
          >
            <animate
              attributeName="r"
              values="4;8;4"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}
    </svg>
  )
}
