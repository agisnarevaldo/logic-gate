"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import ReactFlow, {
    ReactFlowProvider,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
    type Edge,
    type Node,
    type NodeTypes,
    type EdgeTypes,
    type ReactFlowInstance,
} from "reactflow"
import "reactflow/dist/style.css"

import { Card, CardContent } from "@/components/ui/card"
import { SimulatorToolbar } from "./simulator-toolbar"
import { SimulatorControls } from "./simulator-controls"
import { SidebarToggle } from "./sidebar-toggle"
import { InputNode } from "./nodes/input-node"
import { OutputNode } from "./nodes/output-node"
import { GateNode } from "./nodes/gate-node"
import { CustomEdge } from "./edges/custom-edge"
import { v4 as uuidv4 } from "uuid"
import type { ComponentType } from "@/types/simulator"

// Define custom node types
const nodeTypes: NodeTypes = {
    inputNode: InputNode,
    outputNode: OutputNode,
    gateNode: GateNode,
}

// Define custom edge types
const edgeTypes: EdgeTypes = {
    custom: CustomEdge,
}

export function LogicGateSimulator() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
    const [selectedComponent, setSelectedComponent] = useState<ComponentType | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Handle connections between nodes
    const onConnect = useCallback(
        (params: Connection) => {
            // Create a custom edge with the custom type
            const newEdge: Edge = {
                ...params,
                id: `e-${uuidv4()}`,
                source: params.source || '',
                target: params.target || '',
                type: "custom",
                animated: true,
                data: { value: false },
            }
            setEdges((eds) => addEdge(newEdge, eds))
        },
        [setEdges],
    )

    // Handle canvas click for placing components (mobile-friendly)
    const onPaneClick = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            if (!selectedComponent || !reactFlowInstance || !reactFlowWrapper.current) return

            event.preventDefault()
            
            // Get click/touch position
            let clientX: number, clientY: number
            
            if ('touches' in event) {
                // Touch event
                const touch = event.touches[0] || event.changedTouches[0]
                clientX = touch.clientX
                clientY = touch.clientY
            } else {
                // Mouse event
                clientX = event.clientX
                clientY = event.clientY
            }

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
            
            // Get the position where the component should be placed
            const position = reactFlowInstance.screenToFlowPosition({
                x: clientX - reactFlowBounds.left,
                y: clientY - reactFlowBounds.top,
            })

            // Create a new node based on the selected component type
            const newNode: Node = {
                id: `node-${uuidv4()}`,
                position,
                data: { label: selectedComponent, value: false },
            }

            // Set specific node types and properties based on the component type
            switch (selectedComponent) {
                case "INPUT":
                    newNode.type = "inputNode"
                    newNode.data = { ...newNode.data, value: false }
                    break
                case "OUTPUT":
                    newNode.type = "outputNode"
                    newNode.data = { ...newNode.data, value: false }
                    break
                default:
                    newNode.type = "gateNode"
                    newNode.data = { ...newNode.data, gateType: selectedComponent }
                    break
            }

            // Add the new node to the flow
            setNodes((nds) => nds.concat(newNode))
            
            // Clear selection after placing
            setSelectedComponent(null)
        },
        [selectedComponent, reactFlowInstance, setNodes],
    )

    // Handle dropping a new node onto the canvas (keep for desktop compatibility)
    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault()

            if (!reactFlowInstance || !reactFlowWrapper.current) return

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
            const type = event.dataTransfer.getData("application/reactflow") as ComponentType

            // Check if the dropped element is valid
            if (typeof type === "undefined" || !type) {
                return
            }

            // Get the position where the element was dropped
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            })

            // Create a new node based on the type
            const newNode: Node = {
                id: `node-${uuidv4()}`,
                position,
                data: { label: type, value: false },
            }

            // Set specific node types and properties based on the component type
            switch (type) {
                case "INPUT":
                    newNode.type = "inputNode"
                    newNode.data = { ...newNode.data, value: false }
                    break
                case "OUTPUT":
                    newNode.type = "outputNode"
                    newNode.data = { ...newNode.data, value: false }
                    break
                default:
                    newNode.type = "gateNode"
                    newNode.data = { ...newNode.data, gateType: type }
                    break
            }

            // Add the new node to the flow
            setNodes((nds) => nds.concat(newNode))
        },
        [reactFlowInstance, setNodes],
    )

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
    }, [])

    // Clear canvas function
    const clearCanvas = useCallback(() => {
        setNodes([])
        setEdges([])
        setSelectedComponent(null)
    }, [setNodes, setEdges])

    // Simulate the circuit
    const simulate = useCallback(() => {
        // Create a copy of nodes and edges to work with
        const updatedNodes = [...nodes]
        const updatedEdges = [...edges]
        let changed = true
        let iterations = 0
        const MAX_ITERATIONS = 100 // Safety limit

        // Keep simulating until no more changes occur
        while (changed && iterations < MAX_ITERATIONS) {
            changed = false
            iterations++

            // First, propagate values from inputs to outputs along edges
            updatedEdges.forEach((edge) => {
                const sourceNode = updatedNodes.find((n) => n.id === edge.source)
                const targetNode = updatedNodes.find((n) => n.id === edge.target)

                if (!sourceNode || !targetNode) return

                // Get the output value from the source node
                const outputValue = sourceNode.data.value

                // Update the edge data
                edge.data = { ...edge.data, value: outputValue }

                // Update the target node's input values
                if (targetNode.data.inputValues) {
                    const inputIndex = Number.parseInt(edge.targetHandle?.split("-")[1] || "0")
                    const currentInputs = [...targetNode.data.inputValues]

                    if (currentInputs[inputIndex] !== outputValue) {
                        currentInputs[inputIndex] = outputValue
                        targetNode.data = { ...targetNode.data, inputValues: currentInputs }
                        changed = true
                    }
                } else {
                    // For output nodes that don't have inputValues array
                    if (targetNode.data.value !== outputValue) {
                        targetNode.data = { ...targetNode.data, value: outputValue }
                        changed = true
                    }
                }
            })

            // Then, compute the output values for each gate node
            updatedNodes.forEach((node) => {
                if (node.type === "gateNode") {
                    const { gateType, inputValues } = node.data
                    if (!inputValues || inputValues.length < 2) return

                    let outputValue = false

                    // Apply the appropriate logic based on gate type
                    switch (gateType) {
                        case "AND":
                            outputValue = inputValues.every((v: boolean) => v)
                            break
                        case "OR":
                            outputValue = inputValues.some((v: boolean) => v)
                            break
                        case "NOT":
                            outputValue = !inputValues[0]
                            break
                        case "NAND":
                            outputValue = !inputValues.every((v: boolean) => v)
                            break
                        case "NOR":
                            outputValue = !inputValues.some((v: boolean) => v)
                            break
                        case "XOR":
                            outputValue = inputValues.filter((v: boolean) => v).length % 2 === 1
                            break
                        case "XNOR":
                            outputValue = inputValues.filter((v: boolean) => v).length % 2 === 0
                            break
                    }

                    // Update the node's output value if it changed
                    if (node.data.value !== outputValue) {
                        node.data = { ...node.data, value: outputValue }
                        changed = true
                    }
                }
            })
        }

        // Update the state with the simulated values
        setNodes([...updatedNodes])
        setEdges([...updatedEdges])
    }, [nodes, edges, setNodes, setEdges])

    return (
        <div className="flex flex-col gap-3 md:gap-4 relative">
            {/* Sidebar Toggle Button */}
            <SidebarToggle onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <SimulatorToolbar 
                onComponentSelect={setSelectedComponent}
                selectedComponent={selectedComponent}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Main Canvas */}
            <Card className="flex-1">
                <CardContent className="p-0 overflow-hidden rounded-lg h-[calc(100vh-120px)] min-h-[400px]">
                    <div ref={reactFlowWrapper} className="w-full h-full">
                        <ReactFlowProvider>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                onInit={setReactFlowInstance}
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                onPaneClick={onPaneClick}
                                nodeTypes={nodeTypes}
                                edgeTypes={edgeTypes}
                                fitView
                                attributionPosition="bottom-right"
                            >
                                <Background />
                                <Controls />
                            </ReactFlow>
                        </ReactFlowProvider>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Controls */}
            <Card>
                <CardContent className="p-2 md:p-4">
                    <SimulatorControls 
                        onSimulate={simulate} 
                        onClear={clearCanvas}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
