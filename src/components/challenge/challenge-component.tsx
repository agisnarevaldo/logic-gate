'use client'

import React from 'react'
import { ChallengeComponent as ChallengeComponentType } from '@/types/challenge'
import { ToggleLeft, ToggleRight, HelpCircle } from 'lucide-react'

interface ChallengeComponentProps {
  component: ChallengeComponentType
  isActive?: boolean
  onClick?: () => void
}

export const ChallengeComponent: React.FC<ChallengeComponentProps> = ({
  component,
  isActive = false,
  onClick
}) => {
  const renderComponent = () => {
    switch (component.type) {
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
        // Calculate output based on input connections (will be handled by parent)
        const outputValue = component.inputs[0]?.value || false
        return (
          <div className="flex items-center justify-center h-full">
            <div
              className={`w-6 h-6 rounded-full ${
                outputValue ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          </div>
        )
      
      case 'MISSING':
        return (
          <div 
            className={`flex items-center justify-center h-full cursor-pointer transition-all ${
              isActive ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={onClick}
          >
            <HelpCircle className="h-6 w-6 text-gray-500" />
          </div>
        )
      
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <span className="font-bold text-sm">{component.type}</span>
          </div>
        )
    }
  }

  // Calculate port positions
  const renderPorts = () => {
    const portSize = 6
    const portOffset = 3

    return (
      <>
        {/* Input ports */}
        {component.inputs.map((input, index) => {
          const portY = (component.height / (component.inputs.length + 1)) * (index + 1)
          return (
            <div
              key={input.id}
              className={`absolute rounded-full border-2 ${
                input.value ? 'bg-green-500 border-green-700' : 'bg-gray-300 border-gray-500'
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
              className={`absolute rounded-full border-2 ${
                output.value ? 'bg-green-500 border-green-700' : 'bg-gray-300 border-gray-500'
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

  return (
    <div
      className={`absolute bg-white border-2 rounded-md shadow-md ${
        component.type === 'MISSING' ? 'border-dashed border-gray-400' : 'border-gray-300'
      } ${component.isFixed ? 'cursor-default' : 'cursor-pointer'}`}
      style={{
        width: `${component.width}px`,
        height: `${component.height}px`,
        left: `${component.position.x}px`,
        top: `${component.position.y}px`,
      }}
    >
      {renderComponent()}
      {renderPorts()}
    </div>
  )
}
