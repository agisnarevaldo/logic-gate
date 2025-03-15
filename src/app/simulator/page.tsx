"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { SimulatorIcon } from "@/components/icon"
import { SimulatorLayout } from "@/components/simulator/simulator-layout"
import { LogicGateSimulator } from "@/components/simulator/logic-gate-simulator"

export default function SimulatorPage() {
    const [showLoading, setShowLoading] = useState(true)

    return (
        <>
            <AnimatePresence mode="wait">
                {showLoading && (
                    <PageLoadingScreen
                        bgColor="bg-blue-gradient"
                        icon={<SimulatorIcon />}
                        text="Logic Gate Simulator"
                        onComplete={() => setShowLoading(false)}
                    />
                )}
            </AnimatePresence>

            <div className={showLoading ? "hidden" : ""}>
                <SimulatorLayout title="Simulator" icon={<SimulatorIcon />} bgColor="bg-blue-gradient">
                    <div className="mb-4 text-center">
                        <h2 className="text-2xl font-bold mb-2">Logic Gate Simulator</h2>
                        <p className="text-gray-600">
                            Drag components from the toolbar to the canvas. Connect outputs to inputs by clicking on the ports. Use
                            Alt + drag to pan the canvas, and the zoom controls to adjust your view.
                        </p>
                    </div>
                    <LogicGateSimulator />
                </SimulatorLayout>
            </div>
        </>
    )
}
