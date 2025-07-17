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
                    </div>
                    <LogicGateSimulator />
                </SimulatorLayout>
            </div>
        </>
    )
}
