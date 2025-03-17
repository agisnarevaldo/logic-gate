"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Component, ComponentType, Connection, Position, Port, SimulationResult } from "@/types/simulator"

export function useSimulator() {
    const [components, setComponents] = useState<Component[]>([])
    const [connections, setConnections] = useState<Connection[]>([])
    const [simulationResults, setSimulationResults] = useState<SimulationResult>({})

    // Use a ref to track if we're currently simulating to prevent infinite loops
    const isSimulating = useRef(false)

    // Use a ref to track if we need to run simulation
    const needsSimulation = useRef(false)

    // Store previous state to compare and avoid unnecessary simulations
    const prevComponentsRef = useRef<Component[]>([])
    const prevConnectionsRef = useRef<Connection[]>([])

    // Add a new component to the canvas
    const addComponent = useCallback((type: ComponentType, position: Position) => {
        const id = uuidv4()

        let inputs: Port[] = []
        let outputs: Port[] = []

        // Configure ports based on component type
        switch (type) {
            case "INPUT":
                outputs = [{ id: uuidv4(), name: "out", value: false }]
                break
            case "OUTPUT":
                inputs = [{ id: uuidv4(), name: "in", value: false }]
                break
            case "AND":
            case "OR":
            case "XOR":
                inputs = [
                    { id: uuidv4(), name: "in1", value: false },
                    { id: uuidv4(), name: "in2", value: false },
                ]
                outputs = [{ id: uuidv4(), name: "out", value: false }]
                break
            case "NOT":
                inputs = [{ id: uuidv4(), name: "in", value: false }]
                outputs = [{ id: uuidv4(), name: "out", value: false }]
                break
            case "NAND":
            case "NOR":
            case "XNOR":
                inputs = [
                    { id: uuidv4(), name: "in1", value: false },
                    { id: uuidv4(), name: "in2", value: false },
                ]
                outputs = [{ id: uuidv4(), name: "out", value: false }]
                break
        }

        const newComponent: Component = {
            id,
            type,
            position,
            inputs,
            outputs,
            width: 100,
            height: 60,
        }

        setComponents((prev) => {
            const updated = [...prev, newComponent]
            needsSimulation.current = true
            return updated
        })

        return id
    }, [])

    // Remove a component and its connections
    const removeComponent = useCallback((id: string) => {
        setComponents((prev) => {
            const updated = prev.filter((c) => c.id !== id)
            needsSimulation.current = true
            return updated
        })

        // Remove any connections to/from this component
        setConnections((prev) => {
            const updated = prev.filter((conn) => !conn.from.componentId.includes(id) && !conn.to.componentId.includes(id))
            needsSimulation.current = true
            return updated
        })
    }, [])

    // Update component position (for drag & drop)
    const updateComponentPosition = useCallback((id: string, position: Position) => {
        setComponents((prev) => prev.map((comp) => (comp.id === id ? { ...comp, position } : comp)))
        // Position updates don't require simulation
    }, [])

    // Add a connection between components
    const addConnection = useCallback(
        (fromComponentId: string, fromPortId: string, toComponentId: string, toPortId: string) => {
            // Prevent connecting a component to itself
            if (fromComponentId === toComponentId) return

            // Prevent duplicate connections
            const connectionExists = connections.some(
                (conn) =>
                    conn.from.componentId === fromComponentId &&
                    conn.from.portId === fromPortId &&
                    conn.to.componentId === toComponentId &&
                    conn.to.portId === toPortId,
            )

            if (connectionExists) return

            const newConnection: Connection = {
                id: uuidv4(),
                from: {
                    componentId: fromComponentId,
                    portId: fromPortId,
                },
                to: {
                    componentId: toComponentId,
                    portId: toPortId,
                },
            }

            setConnections((prev) => {
                const updated = [...prev, newConnection]
                needsSimulation.current = true
                return updated
            })
        },
        [connections],
    )

    // Remove a connection
    const removeConnection = useCallback((id: string) => {
        setConnections((prev) => {
            const updated = prev.filter((conn) => conn.id !== id)
            needsSimulation.current = true
            return updated
        })
    }, [])

    // Toggle an input component's value
    const toggleInput = useCallback((componentId: string) => {
        setComponents((prev) => {
            const updated = prev.map((comp) => {
                if (comp.id === componentId && comp.type === "INPUT") {
                    const newOutputs = comp.outputs.map((output) => ({
                        ...output,
                        value: !output.value,
                    }))
                    return { ...comp, outputs: newOutputs }
                }
                return comp
            })
            needsSimulation.current = true
            return updated
        })
    }, [])

    // Run the simulation without updating state (for internal use)
    const calculateSimulation = useCallback((comps: Component[], conns: Connection[]) => {
        // Create a copy of components to work with
        let workingComponents = [...comps]
        const results: SimulationResult = {}
        let changed = true

        // Keep simulating until no more changes occur
        let iterations = 0
        const MAX_ITERATIONS = 100 // Safety limit to prevent infinite loops

        while (changed && iterations < MAX_ITERATIONS) {
            changed = false
            iterations++

            // Process each connection
            conns.forEach((connection) => {
                const fromComponent = workingComponents.find((c) => c.id === connection.from.componentId)
                const toComponent = workingComponents.find((c) => c.id === connection.to.componentId)

                if (!fromComponent || !toComponent) return

                const outputPort = fromComponent.outputs.find((p) => p.id === connection.from.portId)
                const inputPort = toComponent.inputs.find((p) => p.id === connection.to.portId)

                if (!outputPort || !inputPort) return

                // If the input value would change, update it
                if (inputPort.value !== outputPort.value) {
                    changed = true

                    // Update the input port value
                    workingComponents = workingComponents.map((comp) => {
                        if (comp.id === toComponent.id) {
                            const newInputs = comp.inputs.map((input) =>
                                input.id === inputPort.id ? { ...input, value: outputPort.value } : input,
                            )
                            return { ...comp, inputs: newInputs }
                        }
                        return comp
                    })
                }
            })

            // Process each gate's logic
            workingComponents = workingComponents.map((comp) => {
                if (comp.type === "INPUT" || comp.type === "OUTPUT") return comp

                const inputValues = comp.inputs.map((input) => input.value)
                let outputValue = false

                // Apply the appropriate logic based on gate type
                switch (comp.type) {
                    case "AND":
                        outputValue = inputValues.every((v) => v)
                        break
                    case "OR":
                        outputValue = inputValues.some((v) => v)
                        break
                    case "NOT":
                        outputValue = !inputValues[0]
                        break
                    case "NAND":
                        outputValue = !inputValues.every((v) => v)
                        break
                    case "NOR":
                        outputValue = !inputValues.some((v) => v)
                        break
                    case "XOR":
                        outputValue = inputValues.filter((v) => v).length % 2 === 1
                        break
                    case "XNOR":
                        outputValue = inputValues.filter((v) => v).length % 2 === 0
                        break
                }

                // Check if output would change
                const currentOutput = comp.outputs[0]
                if (currentOutput && currentOutput.value !== outputValue) {
                    changed = true

                    // Update the output value
                    const newOutputs = comp.outputs.map((output) => ({
                        ...output,
                        value: outputValue,
                    }))

                    return { ...comp, outputs: newOutputs }
                }

                return comp
            })
        }

        // Store results for display
        workingComponents.forEach((comp) => {
            results[comp.id] = {
                inputs: comp.inputs.map((input) => input.value),
                outputs: comp.outputs.map((output) => output.value),
            }
        })

        return { components: workingComponents, results }
    }, [])

    // Public simulation function that updates state
    const simulate = useCallback(() => {
        if (isSimulating.current) return

        try {
            isSimulating.current = true
            const { components: simulatedComponents, results } = calculateSimulation(components, connections)
            setComponents(simulatedComponents)
            setSimulationResults(results)

            // Update refs for comparison
            prevComponentsRef.current = simulatedComponents
            prevConnectionsRef.current = connections

            // Reset simulation flag
            needsSimulation.current = false

            return results
        } finally {
            isSimulating.current = false
        }
    }, [components, connections, calculateSimulation])

    // Use a separate effect for simulation to avoid infinite loops
    useEffect(() => {
        // Skip the initial render or if we're already simulating
        if (components.length === 0 || isSimulating.current) return

        // Check if we need to run simulation
        if (needsSimulation.current) {
            // Use requestAnimationFrame to batch updates and avoid blocking the main thread
            const animationFrame = requestAnimationFrame(() => {
                simulate()
            })

            return () => cancelAnimationFrame(animationFrame)
        }
    }, [components, connections, simulate])

    return {
        components,
        connections,
        simulationResults,
        addComponent,
        removeComponent,
        updateComponentPosition,
        addConnection,
        removeConnection,
        toggleInput,
        simulate,
    }
}

