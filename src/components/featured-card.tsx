"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface FeatureCardProps {
  href: string
  bgColor: string
  icon: ReactNode
  label?: string
}

export function FeatureCard({ href, bgColor, icon, label }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      <Link
        href={href}
        className={`${bgColor} rounded-2xl flex items-center justify-center p-6 shadow-md relative overflow-hidden group`}
      >
        {/* Subtle hover glow effect */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex flex-col items-center relative z-10">
          {/* Icon with subtle bounce animation */}
          <motion.div
            className="text-white w-16 h-16 flex items-center justify-center"
            animate={{
              y: [0, -4, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2 // Random delay for each card
            }}
          >
            {icon}
          </motion.div>

          {label && (
            <span className="mt-2 text-white font-medium group-hover:text-white/90 transition-colors duration-200">
              {label}
            </span>
          )}
        </div>

        {/* Single subtle sparkle effect */}
        <motion.div
          className="absolute top-3 right-3 w-1 h-1 bg-white rounded-full"
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      </Link>
    </motion.div>
  )
}
