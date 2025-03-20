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
                        text="Simulator"
                        onComplete={() => setShowLoading(false)}
                    />
                )}
            </AnimatePresence>

            <div className={showLoading ? "hidden" : ""}>
                <SimulatorLayout title="Simulator" icon={<SimulatorIcon />} bgColor="bg-blue-gradient">
                    <div className="mb-3 md:mb-4 text-center">
                        <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Logic Gate Simulator</h2>
                        {/*<p className="text-gray-600 text-sm md:text-base px-2">*/}
                        {/*    Drag components from the toolbar to the canvas. Connect nodes by dragging from outputs (right) to inputs*/}
                        {/*    (left). Use the controls to pan and zoom. Click on input toggles to change their state.*/}
                        {/*</p>*/}
                    </div>
                    <LogicGateSimulator />
                </SimulatorLayout>
            </div>
        </>
    )
}
