"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface PageLoadingScreenProps {
    bgColor: string
    icon: React.ReactNode
    text: string
    onComplete: () => void
}

export function PageLoadingScreen({ bgColor, icon, text, onComplete }: PageLoadingScreenProps) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Set a timeout to hide the loading screen after animation completes
        const timer = setTimeout(() => {
            setIsVisible(false)
            onComplete()
        }, 2500)

        return () => clearTimeout(timer)
    }, [onComplete])

    if (!isVisible) return null

    return (
        <motion.div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${bgColor} overflow-hidden h-screen`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col items-center justify-center gap-6 text-white">
                <div className="flex gap-3.5 items-center justify-center">
                    {/* Icon animation */}
                    <motion.div
                        className="text-white w-16 h-16"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            scale: { type: "spring", bounce: 0.5 },
                            delay: 0.3,
                        }}
                    >
                        {icon}
                    </motion.div>

                    {/* Text animation */}
                    <motion.h1
                        className="text-3xl font-bold text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        {text}
                    </motion.h1>
                </div>

                {/* Progress bar */}
                <motion.div
                    className="w-64 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                >
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/30">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 1.2,
                                delay: 1.2,
                                ease: "easeInOut",
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
