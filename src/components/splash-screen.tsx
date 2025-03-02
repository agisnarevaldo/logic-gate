"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Set a timeout to hide the splash screen after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 3500)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-end animated-gradient overflow-hidden h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex flex-col items-center justify-end gap-4 h-full w-full">

        {/* Text animation - letter by letter */}
        <motion.div className="text-center">
          <motion.h1
            className="text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            {Array.from("LogiFun").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 1.2 + index * 0.1,
                  ease: "easeOut",
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="text-white/80 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            Where Learning Meets Fun!
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
        >
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/30">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 1.2,
                delay: 2.2,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

      </div>
        {/* Logo animation */}
        <motion.div
          className=""
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            scale: { type: "spring", visualDuration: 0.8, bounce: 0.5 },
            delay: 0.3,
          }}
        >
          <div className="w-full h-[451px]">
            <Image src="/images/illustration.svg" width={393} height={451} alt="illustration" />
          </div>
        </motion.div>
    </motion.div>
  )
}

