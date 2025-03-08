"use client"

import { LogicGateSimulator } from "@/components/simulator/logic-gate-simulator"

export default function SimulatorPage() {
    return (
        <div className="min-h-screen bg-blue-gradient flex flex-col items-center p-4">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-center">Logic Gate Simulator</h1>
                <p className="text-center text-muted-foreground mb-4">
                    Drag and drop logic gates, connect them with wires, and see the results in real-time
                </p>
                <LogicGateSimulator />
            </div>
        </div>
    )
}
