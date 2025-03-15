"use client"

import { SimulatorToolbar } from "./simulator-toolbar"
import { SimulatorCanvas } from "./simulator-canvas"
import { useSimulator } from "@/hooks/use-simulator"
import { Card, CardContent } from "@/components/ui/card"
import {SimulatorControls} from "@/components/simulator/simulator-controls";

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
        <div className="flex flex-col gap-4">
            <Card>
                <CardContent className="p-4">
                    <SimulatorToolbar onAddComponent={addComponent} />
                </CardContent>
            </Card>

            <Card className="flex-1">
                <CardContent className="p-0 overflow-hidden rounded-lg h-[calc(100vh-400px)] min-h-[400px]">
                    <SimulatorCanvas
                        components={components}
                        connections={connections}
                        onUpdatePosition={updateComponentPosition}
                        onAddConnection={addConnection}
                        onRemoveConnection={removeConnection}
                        onRemoveComponent={removeComponent}
                        onToggleInput={toggleInput}
                        onAddComponent={addComponent}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <SimulatorControls onSimulate={simulate} />
                </CardContent>
            </Card>
        </div>
    )
}
