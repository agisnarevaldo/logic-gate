"use client"
import { SimulatorToolbar } from "@/components/simulator-toolbar"
import { SimulatorCanvas } from "@/components/simulator-canvas"
import { SimulatorControls } from "@/components/simulator-controls"
import { useSimulator } from "@/hooks/use-simulator"

export function LogicGateSimulator() {
    const {
        components,
        connections,
        addComponent,
        removeComponent,
        updateComponentPosition,
        addConnection,
        removeConnection,
        toggleInput,
        simulate,
    } = useSimulator()

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-200px)] min-h-[600px]">
            <SimulatorToolbar onAddComponent={addComponent}/>
            <div className="flex-1 relative border border-border rounded-lg overflow-hidden">
                <SimulatorCanvas
                    components={components}
                    connections={connections}
                    onUpdatePosition={updateComponentPosition}
                    onAddConnection={addConnection}
                    onRemoveConnection={removeConnection}
                    onRemoveComponent={removeComponent}
                    onToggleInput={toggleInput}
                    onAddComponent={addComponent}            />
            </div>
            <SimulatorControls onSimulate={simulate} />
        </div>
    )
}
