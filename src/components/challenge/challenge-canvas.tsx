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
  showHint?: boolean
}

export const ChallengeCanvas: React.FC<ChallengeCanvasProps> = ({
  challenge,
  userAnswers,
  selectedMissingId,
  onMissingComponentClick,
  showHint = false
}) => {
  // Create updated components with user answers and calculate their values
  const { updatedComponents, connectionValues } = useMemo(() => {
    // First, replace MISSING components with user answers (deep clone)
    const components: ChallengeComponentType[] = challenge.components.map(component => {
      // Deep clone to avoid mutation issues
      const clonedComponent: ChallengeComponentType = {
        ...component,
        position: { ...component.position },
        inputs: component.inputs.map(input => ({ ...input })),
        outputs: component.outputs.map(output => ({ ...output }))
      }

      if (component.type === 'MISSING' && userAnswers[challenge.id]) {
        clonedComponent.type = userAnswers[challenge.id] as 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR'
      }

      return clonedComponent
    })

    // Calculate logic gate outputs
    const calculateGateOutput = (gateType: string, inputs: boolean[]): boolean => {
      switch (gateType) {
        case 'AND':
          return inputs.length > 0 && inputs.every(input => input)
        case 'OR':
          return inputs.some(input => input)
        case 'NOT':
          // NOT gate only uses first input
          return inputs.length > 0 ? !inputs[0] : true
        case 'NAND':
          return inputs.length === 0 || !inputs.every(input => input)
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

    // Set initial input values from challenge data
    components.forEach(component => {
      if (component.type === 'INPUT') {
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

        // Calculate input values for this component based on connections
        const inputValues: boolean[] = []

        // Get connected inputs only (important for NOT gate which may have multiple input ports defined but only one connected)
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
                const newValue = sourceOutput.value ?? false
                if (input.value !== newValue) {
                  input.value = newValue
                  changed = true
                }
                inputValues.push(newValue)
              }
            }
          }
          // Don't push false for unconnected inputs - just skip them
        })

        // Calculate output based on gate type and inputs
        // For logic gates (not INPUT, OUTPUT, or unresolved MISSING)
        if (component.type !== 'OUTPUT' && component.type !== 'MISSING') {
          const outputValue = calculateGateOutput(component.type, inputValues)
          component.outputs.forEach(output => {
            if (output.value !== outputValue) {
              output.value = outputValue
              changed = true
            }
          })
        } else if (component.type === 'OUTPUT') {
          // For output components, just copy the first input value
          if (inputValues.length > 0) {
            component.outputs.forEach(output => {
              if (output.value !== inputValues[0]) {
                output.value = inputValues[0]
                changed = true
              }
            })
            // Also update the input display value
            if (component.inputs.length > 0) {
              component.inputs[0].value = inputValues[0]
            }
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
        if (sourceOutput !== undefined) {
          connectionVals[`${connection.from.componentId}-${connection.to.componentId}`] = sourceOutput.value ?? false
        }
      }
    })

    return { updatedComponents: components, connectionValues: connectionVals }
  }, [challenge, userAnswers])

  // Calculate canvas dimensions
  const minX = Math.min(...updatedComponents.map(c => c.position.x))
  const maxX = Math.max(...updatedComponents.map(c => c.position.x + c.width))
  const maxY = Math.max(...updatedComponents.map(c => c.position.y + c.height)) + 50

  // Calculate offset to move content to the left edge (mentok kiri)
  const contentWidth = maxX - minX
  const canvasWidth = Math.max(contentWidth + 40, 400) // Min width 400px with minimal padding
  const offsetX = 20 - minX // Move to left edge with minimal 20px padding

  return (
    <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-50 border rounded-lg relative overflow-auto">
      <div
        className="relative"
        style={{
          width: `${canvasWidth}px`,
          height: `${Math.max(maxY, 250)}px`,
          minWidth: '100%'
        }}
      >
        {/* Render connections */}
        {challenge.connections.map((connection, index) => {
          // Get connection value from simulation results
          const connectionKey = `${connection.from.componentId}-${connection.to.componentId}`
          const value = connectionValues[connectionKey] || false

          // Apply offset to component positions for connection rendering
          const offsetComponents = updatedComponents.map(comp => ({
            ...comp,
            position: {
              x: comp.position.x + offsetX,
              y: comp.position.y
            }
          }))

          return (
            <ChallengeConnection
              key={index}
              connection={{
                fromComponent: connection.from.componentId,
                fromPort: connection.from.portId,
                toComponent: connection.to.componentId,
                toPort: connection.to.portId
              }}
              components={offsetComponents}
              value={value}
            />
          )
        })}

        {/* Render components using the new gate node component */}
        {updatedComponents.map((component) => (
          <ChallengeGateNode
            key={component.id}
            component={{
              ...component,
              position: {
                x: component.position.x + offsetX,
                y: component.position.y
              }
            }}
            isActive={selectedMissingId === component.id}
            showHint={showHint && component.type === 'MISSING'}
            onClick={() => {
              // Allow clicking on missing components or the specific missing component for this challenge
              // Even if it's already answered, to allow re-selection
              if (component.type === 'MISSING' || component.id === challenge.missingComponentId) {
                onMissingComponentClick(component.id)
              }
            }}
          />
        ))}

        {/* Circuit info overlay */}
        <div
          className="absolute top-2 bg-white/5 px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-sm border text-xs sm:text-sm font-medium"
          style={{ left: `${offsetX + 44}px` }}
        >
          <div className="flex items-start sm:items-center gap-1 sm:gap-4">
            <span className="text-gray-600 text-xs">
              Input: {Object.entries(challenge.inputValues)
                .filter(([id]) => challenge.components.find(c => c.id === id && c.type === 'INPUT'))
                .map(([, value]) => value ? '1' : '0')
                .join(', ')}
            </span>
            <span className="text-gray-600 hidden sm:inline">→</span>
            <span className="text-gray-600 text-xs">
              Expected: {challenge.expectedOutput ? '1' : '0'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
