'use client'

import React, { useMemo } from 'react'
import { Challenge, ChallengeComponent as ChallengeComponentType } from '@/types/challenge'
import { ChallengeGateNode } from './challenge-gate-node'
import { ChallengeConnection } from './challenge-connection'

interface ChallengeCanvasProps {
  challenge: Challenge
  userAnswers: Record<string, string>
  selectedMissingId: string | null
  onMissingComponentClick: (id: string) => void
}

export const ChallengeCanvas: React.FC<ChallengeCanvasProps> = ({
  challenge,
  userAnswers,
  selectedMissingId,
  onMissingComponentClick
}) => {
  // Create updated components with user answers and calculate their values
  const { updatedComponents, connectionValues } = useMemo(() => {
    // First, replace MISSING components with user answers
    const components: ChallengeComponentType[] = challenge.components.map(component => {
      if (component.type === 'MISSING' && userAnswers[challenge.id]) {
        return {
          ...component,
          type: userAnswers[challenge.id] as 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR'
        }
      }
      return { ...component }
    })

    // Calculate logic gate outputs
    const calculateGateOutput = (gateType: string, inputs: boolean[]): boolean => {
      switch (gateType) {
        case 'AND':
          return inputs.every(input => input)
        case 'OR':
          return inputs.some(input => input)
        case 'NOT':
          return !inputs[0]
        case 'NAND':
          return !inputs.every(input => input)
        case 'NOR':
          return !inputs.some(input => input)
        case 'XOR':
          return inputs.filter(input => input).length === 1
        case 'XNOR':
          return inputs.filter(input => input).length !== 1
        default:
          return false
      }
    }

    // Set initial input values
    components.forEach(component => {
      if (component.type === 'INPUT') {
        // Set input component values from challenge data
        const inputValue = challenge.inputValues[component.id] ?? false
        component.outputs.forEach(output => {
          output.value = inputValue
        })
      }
    })

    // Simulate the circuit by propagating values through connections
    let changed = true
    let iterations = 0
    const maxIterations = 10 // Prevent infinite loops

    while (changed && iterations < maxIterations) {
      changed = false
      iterations++

      components.forEach(component => {
        if (component.type === 'INPUT') return // Skip input components

        // Calculate input values for this component
        const inputValues: boolean[] = []
        component.inputs.forEach(input => {
          // Find connection that feeds this input
          const connection = challenge.connections.find(
            conn => conn.to.componentId === component.id && conn.to.portId === input.id
          )
          
          if (connection) {
            // Find source component and get its output value
            const sourceComponent = components.find(c => c.id === connection.from.componentId)
            if (sourceComponent) {
              const sourceOutput = sourceComponent.outputs.find(o => o.id === connection.from.portId)
              if (sourceOutput) {
                const newValue = sourceOutput.value || false
                if (input.value !== newValue) {
                  input.value = newValue
                  changed = true
                }
                inputValues.push(newValue)
              }
            }
          } else {
            inputValues.push(false)
          }
        })

        // Calculate output based on gate type and inputs
        if (component.type !== 'OUTPUT' && component.type !== 'MISSING') {
          const outputValue = calculateGateOutput(component.type, inputValues)
          component.outputs.forEach(output => {
            if (output.value !== outputValue) {
              output.value = outputValue
              changed = true
            }
          })
        } else if (component.type === 'OUTPUT') {
          // For output components, just copy the input value
          if (inputValues.length > 0) {
            component.outputs.forEach(output => {
              if (output.value !== inputValues[0]) {
                output.value = inputValues[0]
                changed = true
              }
            })
          }
        }
      })
    }

    // Calculate connection values for wire visualization
    const connectionVals: Record<string, boolean> = {}
    challenge.connections.forEach(connection => {
      const sourceComponent = components.find(c => c.id === connection.from.componentId)
      if (sourceComponent) {
        const sourceOutput = sourceComponent.outputs.find(o => o.id === connection.from.portId)
        if (sourceOutput) {
          connectionVals[`${connection.from.componentId}-${connection.to.componentId}`] = sourceOutput.value || false
        }
      }
    })

    return { updatedComponents: components, connectionValues: connectionVals }
  }, [challenge, userAnswers])

  // Calculate canvas dimensions
  const maxX = Math.max(...updatedComponents.map(c => c.position.x + c.width)) + 50
  const maxY = Math.max(...updatedComponents.map(c => c.position.y + c.height)) + 50

  return (
    <div className="w-full h-96 bg-gray-50 border rounded-lg relative overflow-auto">
      <div 
        className="relative"
        style={{ 
          width: `${Math.max(maxX, 600)}px`, 
          height: `${Math.max(maxY, 300)}px` 
        }}
      >
        {/* Render connections */}
        {challenge.connections.map((connection, index) => {
          // Get connection value from simulation results
          const connectionKey = `${connection.from.componentId}-${connection.to.componentId}`
          const value = connectionValues[connectionKey] || false
          
          return (
            <ChallengeConnection
              key={index}
              connection={{
                fromComponent: connection.from.componentId,
                fromPort: connection.from.portId,
                toComponent: connection.to.componentId,
                toPort: connection.to.portId
              }}
              components={updatedComponents}
              value={value}
            />
          )
        })}

        {/* Render components using the new gate node component */}
        {updatedComponents.map((component) => (
          <ChallengeGateNode
            key={component.id}
            component={component}
            isActive={selectedMissingId === component.id}
            onClick={() => {
              if (component.type === 'MISSING' || component.id === challenge.missingComponentId) {
                onMissingComponentClick(component.id)
              }
            }}
          />
        ))}

        {/* Circuit info overlay */}
        <div className="absolute top-2 left-2 bg-white px-3 py-2 rounded-lg shadow-sm border text-sm font-medium">
          {challenge.title}
        </div>

        {/* Input/Output values display */}
        <div className="absolute bottom-2 left-2 bg-white px-3 py-2 rounded-lg shadow-sm border text-xs">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Input: {Object.entries(challenge.inputValues)
                .filter(([id]) => challenge.components.find(c => c.id === id && c.type === 'INPUT'))
                .map(([, value]) => value ? '1' : '0')
                .join(', ')}
            </span>
            <span className="text-gray-600">→</span>
            <span className="text-gray-600">
              Expected: {challenge.expectedOutput ? '1' : '0'}
            </span>
            {/* Show actual output if circuit is complete */}
            {Object.keys(userAnswers).length > 0 && (
              <>
                <span className="text-gray-600">|</span>
                <span className={`font-medium ${
                  updatedComponents.find(c => c.type === 'OUTPUT')?.outputs[0]?.value === challenge.expectedOutput 
                    ? 'text-green-600' : 'text-red-600'
                }`}>
                  Actual: {updatedComponents.find(c => c.type === 'OUTPUT')?.outputs[0]?.value ? '1' : '0'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
