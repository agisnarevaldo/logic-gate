"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { shuffle } from "@/utils/array-utils"
import {
  AndGateSymbol,
  OrGateSymbol,
  NotGateSymbol,
  NandGateSymbol,
  NorGateSymbol,
  XorGateSymbol,
  XnorGateSymbol,
  BufferGateSymbol,
} from "./logic-gate-symbols"

interface QuizItem {
  id: string
  name: string
  symbol: React.ReactNode
}

const quizItems: QuizItem[] = [
  { id: "and", name: "AND Gate", symbol: <AndGateSymbol className="w-full h-full" /> },
  { id: "or", name: "OR Gate", symbol: <OrGateSymbol className="w-full h-full" /> },
  { id: "not", name: "NOT Gate", symbol: <NotGateSymbol className="w-full h-full" /> },
  { id: "nand", name: "NAND Gate", symbol: <NandGateSymbol className="w-full h-full" /> },
  { id: "nor", name: "NOR Gate", symbol: <NorGateSymbol className="w-full h-full" /> },
  { id: "xor", name: "XOR Gate", symbol: <XorGateSymbol className="w-full h-full" /> },
  { id: "xnor", name: "XNOR Gate", symbol: <XnorGateSymbol className="w-full h-full" /> },
  { id: "buffer", name: "Buffer Gate", symbol: <BufferGateSymbol className="w-full h-full" /> },
]

interface Connection {
  nameId: string
  symbolId: string
  correct: boolean
  namePos: { x: number; y: number }
  symbolPos: { x: number; y: number }
}

export function MatchingQuiz() {
  const [names, setNames] = useState<QuizItem[]>([])
  const [symbols, setSymbols] = useState<QuizItem[]>([])
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const [connections, setConnections] = useState<Connection[]>([])
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize the quiz with shuffled items
  useEffect(() => {
    resetQuiz()
  }, [])

  const resetQuiz = () => {
    setNames(shuffle([...quizItems]))
    setSymbols(shuffle([...quizItems]))
    setSelectedName(null)
    setSelectedSymbol(null)
    setConnections([])
    setCompleted(false)
    setScore(0)
    setAttempts(0)
  }

  const handleNameClick = (id: string) => {
    // If this name is already connected, do nothing
    if (connections.some((conn) => conn.nameId === id)) return

    setSelectedName(id)

    // If a symbol was already selected, try to make a connection
    if (selectedSymbol) {
      tryConnection(id, selectedSymbol)
    }
  }

  const handleSymbolClick = (id: string) => {
    // If this symbol is already connected, do nothing
    if (connections.some((conn) => conn.symbolId === id)) return

    setSelectedSymbol(id)

    // If a name was already selected, try to make a connection
    if (selectedName) {
      tryConnection(selectedName, id)
    }
  }

  const tryConnection = (nameId: string, symbolId: string) => {
    // Get positions for drawing the connection line
    const nameElement = document.getElementById(`name-${nameId}`)
    const symbolElement = document.getElementById(`symbol-${symbolId}`)

    if (!nameElement || !symbolElement || !containerRef.current) {
      setSelectedName(null)
      setSelectedSymbol(null)
      return
    }

    const containerRect = containerRef.current.getBoundingClientRect()
    const nameRect = nameElement.getBoundingClientRect()
    const symbolRect = symbolElement.getBoundingClientRect()

    const namePos = {
      x: nameRect.right - containerRect.left,
      y: nameRect.top + nameRect.height / 2 - containerRect.top,
    }

    const symbolPos = {
      x: symbolRect.left - containerRect.left,
      y: symbolRect.top + symbolRect.height / 2 - containerRect.top,
    }

    // Check if the connection is correct
    const isCorrect = nameId === symbolId

    // Add the new connection
    setConnections((prev) => [
      ...prev,
      {
        nameId,
        symbolId,
        correct: isCorrect,
        namePos,
        symbolPos,
      },
    ])

    // Update score and attempts
    setAttempts((prev) => prev + 1)
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    // Reset selections
    setSelectedName(null)
    setSelectedSymbol(null)

    // Check if quiz is completed
    if (connections.length + 1 === quizItems.length) {
      setCompleted(true)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Match Logic Gates with Their Symbols</h2>
        <p className="text-gray-600">Click on a name and then on its corresponding symbol to make a connection.</p>
        <div className="mt-4 flex justify-center gap-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">Score</p>
            <p className="text-2xl font-bold">
              {score}/{quizItems.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Attempts</p>
            <p className="text-2xl font-bold">{attempts}</p>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative flex flex-col md:flex-row justify-between gap-8 min-h-[400px] md:min-h-[500px]"
      >
        {/* Names Column */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          {names.map((item) => {
            const isConnected = connections.some((conn) => conn.nameId === item.id)
            const isSelected = selectedName === item.id
            const connection = connections.find((conn) => conn.nameId === item.id)

            return (
              <button
                key={item.id}
                id={`name-${item.id}`}
                onClick={() => handleNameClick(item.id)}
                disabled={isConnected}
                className={`p-4 rounded-lg text-left transition-all ${
                  isConnected
                    ? connection?.correct
                      ? "bg-green-100 border-2 border-green-500"
                      : "bg-red-100 border-2 border-red-500"
                    : isSelected
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-white border-2 border-gray-300 hover:border-blue-300"
                }`}
              >
                <span className="font-medium">{item.name}</span>
              </button>
            )
          })}
        </div>

        {/* Connection Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            {connections.map((conn) => (
              <motion.path
                key={`${conn.nameId}-${conn.symbolId}`}
                d={`M ${conn.namePos.x} ${conn.namePos.y} C ${conn.namePos.x + 50} ${conn.namePos.y}, ${
                  conn.symbolPos.x - 50
                } ${conn.symbolPos.y}, ${conn.symbolPos.x} ${conn.symbolPos.y}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
                stroke={conn.correct ? "#22c55e" : "#ef4444"}
                strokeWidth="3"
                fill="none"
              />
            ))}
          </svg>
        </div>

        {/* Symbols Column */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          {symbols.map((item) => {
            const isConnected = connections.some((conn) => conn.symbolId === item.id)
            const isSelected = selectedSymbol === item.id
            const connection = connections.find((conn) => conn.symbolId === item.id)

            return (
              <button
                key={item.id}
                id={`symbol-${item.id}`}
                onClick={() => handleSymbolClick(item.id)}
                disabled={isConnected}
                className={`p-4 rounded-lg flex items-center justify-center h-24 transition-all ${
                  isConnected
                    ? connection?.correct
                      ? "bg-green-100 border-2 border-green-500"
                      : "bg-red-100 border-2 border-red-500"
                    : isSelected
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-white border-2 border-gray-300 hover:border-blue-300"
                }`}
              >
                <div className="w-20 h-20">{item.symbol}</div>
              </button>
            )
          })}
        </div>
      </div>

      {completed && (
        <div className="mt-8 text-center">
          <h3 className="text-xl font-bold mb-2">
            Quiz Completed! Score: {score}/{quizItems.length}
          </h3>
          <button
            onClick={resetQuiz}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}