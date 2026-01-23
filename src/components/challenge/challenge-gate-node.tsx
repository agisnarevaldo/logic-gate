'use client'

import React from 'react'
import {
  AndGateSymbol,
  OrGateSymbol,
  NotGateSymbol,
  NandGateSymbol,
  NorGateSymbol,
  XorGateSymbol,
  XnorGateSymbol
} from "@/components/quiz/logic-gate-symbols"
import { ChallengeComponent as ChallengeComponentType } from '@/types/challenge'
import { ToggleLeft, ToggleRight, HelpCircle } from 'lucide-react'

interface ChallengeGateNodeProps {
  component: ChallengeComponentType
  isActive?: boolean
  onClick?: () => void
  showHint?: boolean
}

export const ChallengeGateNode: React.FC<ChallengeGateNodeProps> = ({
  component,
  isActive = false,
  onClick,
  showHint = false
}) => {
  const renderGateSymbol = () => {
    const symbolProps = { className: "w-full h-full" }

    switch (component.type) {
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
      case 'XNOR':
        return <XnorGateSymbol {...symbolProps} />
      case 'INPUT':
        // Get the output value from component data
        const inputValue = component.outputs[0]?.value || false
        return (
          <div className="flex items-center justify-center h-full">
            {inputValue ? (
              <ToggleRight className="h-6 w-6 text-green-500" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-gray-500" />
            )}
          </div>
        )
      case 'OUTPUT':
        // Calculate output based on input connections
        const outputValue = component.inputs[0]?.value || false
        return (
          <div className="flex items-center justify-center h-full">
            <div
              className={`w-6 h-6 rounded-full ${outputValue ? 'bg-green-500' : 'bg-gray-300'
                }`}
            />
          </div>
        )
      case 'MISSING':
        return (
          <div className="flex items-center justify-center h-full">
            <HelpCircle className="h-6 w-6 text-gray-500" />
          </div>
        )
      default:
        return <div className="text-xs font-bold text-center">{component.type}</div>
    }
  }

  const renderPorts = () => {
    const portSize = 6
    const portOffset = 3

    return (
      <>
        {/* Input ports */}
        {component.inputs.map((input, index) => {
          const portY = component.type === 'NOT'
            ? component.height / 2
            : (component.height / (component.inputs.length + 1)) * (index + 1)

          return (
            <div
              key={input.id}
              className={`absolute rounded-full border-2 ${input.value ? 'bg-green-500 border-green-700' : 'bg-gray-300 border-gray-500'
                }`}
              style={{
                left: -portOffset,
                top: portY - portOffset,
                width: `${portSize * 2}px`,
                height: `${portSize * 2}px`,
              }}
            />
          )
        })}

        {/* Output ports */}
        {component.outputs.map((output, index) => {
          const portY = (component.height / (component.outputs.length + 1)) * (index + 1)
          return (
            <div
              key={output.id}
              className={`absolute rounded-full border-2 ${output.value ? 'bg-green-500 border-green-700' : 'bg-gray-300 border-gray-500'
                }`}
              style={{
                right: -portOffset,
                top: portY - portOffset,
                width: `${portSize * 2}px`,
                height: `${portSize * 2}px`,
              }}
            />
          )
        })}
      </>
    )
  }

  const isClickable = component.type === 'MISSING'

  const shouldShowHint = showHint && component.type === 'MISSING'

  return (
    <div
      className={`absolute bg-white border-2 rounded-lg shadow-md ${component.type === 'MISSING'
        ? `border-dashed cursor-pointer transition-all ${shouldShowHint
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-400 ring-offset-2 animate-pulse'
          : isActive
            ? 'bg-blue-100 ring-2 ring-blue-500 border-blue-400'
            : 'border-gray-400 hover:bg-gray-50'
        }`
        : 'border-gray-300'
        } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
      style={{
        width: `${component.width}px`,
        height: `${component.height}px`,
        left: `${component.position.x}px`,
        top: `${component.position.y}px`,
      }}
      onClick={isClickable ? onClick : undefined}
    >
      {/* Gate Symbol */}
      <div className="w-full h-full p-1">
        {renderGateSymbol()}
      </div>

      {/* Render connection ports */}
      {renderPorts()}

      {/* Hint label for MISSING component */}
      {shouldShowHint && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-lg whitespace-nowrap z-10">
          👆 Klik di sini!
        </div>
      )}
    </div>
  )
}
