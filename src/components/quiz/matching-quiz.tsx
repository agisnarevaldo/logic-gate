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
} from "./logic-gate-symbols"

interface QuizItem {
  id: string
  name: string
  symbol: React.ReactNode
}

const quizItems: QuizItem[] = [
  { id: "and", name: "AND", symbol: <AndGateSymbol className="w-full h-full" /> },
  { id: "or", name: "OR", symbol: <OrGateSymbol className="w-full h-full" /> },
  { id: "not", name: "NOT", symbol: <NotGateSymbol className="w-full h-full" /> },
  { id: "nand", name: "NAND", symbol: <NandGateSymbol className="w-full h-full" /> },
  { id: "nor", name: "NOR", symbol: <NorGateSymbol className="w-full h-full" /> },
  { id: "xor", name: "XOR", symbol: <XorGateSymbol className="w-full h-full" /> },
  { id: "xnor", name: "XNOR", symbol: <XnorGateSymbol className="w-full h-full" /> },
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
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
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
    setSubmitted(false)
    setScore(0)
  }

  const handleNameClick = (id: string) => {
    if (submitted) return

    // If this name is already connected, remove the connection
    const existingConnection = connections.find((conn) => conn.nameId === id)
    if (existingConnection) {
      setConnections(connections.filter((conn) => conn.nameId !== id))
      return
    }

    // If this name is already selected, deselect it
    if (selectedName === id) {
      setSelectedName(null)
      return
    }

    setSelectedName(id)

    // If a symbol was already selected, make a connection
    if (selectedSymbol) {
      makeConnection(id, selectedSymbol)
    }
  }

  const handleSymbolClick = (id: string) => {
    if (submitted) return

    // If this symbol is already connected, remove the connection
    const existingConnection = connections.find((conn) => conn.symbolId === id)
    if (existingConnection) {
      setConnections(connections.filter((conn) => conn.symbolId !== id))
      return
    }

    // If this symbol is already selected, deselect it
    if (selectedSymbol === id) {
      setSelectedSymbol(null)
      return
    }

    setSelectedSymbol(id)

    // If a name was already selected, make a connection
    if (selectedName) {
      makeConnection(selectedName, id)
    }
  }

  const makeConnection = (nameId: string, symbolId: string) => {
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

    const correct = nameId === symbolId

    // Add the new connection
    setConnections((prev) => [
      ...prev,
      { nameId, symbolId, correct, namePos, symbolPos }
    ])

    // Reset selections
    setSelectedName(null)
    setSelectedSymbol(null)
  }

  const handleSubmit = () => {
    if (connections.length !== quizItems.length) return

    // Calculate score
    const correctCount = connections.filter(conn => conn.correct).length
    setScore(correctCount)
    setSubmitted(true)
  }

  const isConnected = (id: string, type: 'name' | 'symbol') => {
    return connections.some((conn) => 
      type === 'name' ? conn.nameId === id : conn.symbolId === id
    )
  }

  const getConnectionResult = (id: string, type: 'name' | 'symbol') => {
    if (!submitted) return null
    const connection = connections.find((conn) => 
      type === 'name' ? conn.nameId === id : conn.symbolId === id
    )
    if (!connection) return null
    return connection.correct
  }

  const canSubmit = connections.length === quizItems.length

  return (
    <div className="w-full max-w-6xl mx-auto px-1">
      <div className="mb-2 text-center">
        <h2 className="text-lg font-bold mb-1">Cocokkan Gerbang Logika</h2>
        
        {submitted && (
          <div className="mb-4">
            <div className="text-xl font-bold text-blue-600 mb-2">
              Skor: {score}/{quizItems.length}
            </div>
            <div className="text-sm text-gray-600">
              {score === quizItems.length ? "Sempurna! 🎉" : 
               score >= quizItems.length * 0.7 ? "Bagus! 👍" : "Perlu belajar lagi 📚"}
            </div>
          </div>
        )}
      </div>

      <div 
        ref={containerRef}
        className="relative flex justify-between items-start min-h-[320px] p-4"
      >
        {/* Connection Lines - Using beautiful curved SVG paths */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            {connections.map((conn) => (
              <motion.path
                key={`${conn.nameId}-${conn.symbolId}`}
                d={`M ${conn.namePos.x} ${conn.namePos.y} C ${conn.namePos.x + 80} ${conn.namePos.y}, ${
                  conn.symbolPos.x - 80
                } ${conn.symbolPos.y}, ${conn.symbolPos.x} ${conn.symbolPos.y}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
                stroke={
                  submitted
                    ? conn.correct
                      ? "#22c55e"
                      : "#ef4444"
                    : "#3b82f6"
                }
                strokeWidth="3"
                fill="none"
              />
            ))}
          </svg>
        </div>

        {/* Names Column - Left */}
        <div className="w-20 flex flex-col gap-2 z-20 relative">
          {/* <h3 className="text-sm font-semibold text-center mb-1 text-gray-700">Nama</h3> */}
          {names.map((item) => {
            const connected = isConnected(item.id, 'name')
            const isSelected = selectedName === item.id
            const isCorrect = getConnectionResult(item.id, 'name')

            return (
              <button
                key={item.id}
                id={`name-${item.id}`}
                onClick={() => handleNameClick(item.id)}
                disabled={submitted}
                className={`px-1 py-2 rounded-lg text-center font-medium transition-all text-sm ${
                  submitted && connected
                    ? isCorrect
                      ? "bg-green-100 border-2 border-green-500 text-green-800"
                      : "bg-red-100 border-2 border-red-500 text-red-800"
                    : connected
                    ? "bg-blue-100 border-2 border-blue-500 text-blue-800"
                    : isSelected
                    ? "bg-yellow-100 border-2 border-yellow-500 text-yellow-800"
                    : "bg-white border-2 border-gray-300 hover:border-blue-300 text-gray-700"
                } ${submitted ? "cursor-default" : "cursor-pointer"}`}
              >
                {item.name}
              </button>
            )
          })}
        </div>

        {/* Symbols Column - Right */}
        <div className="w-16 flex flex-col gap-2 z-20 relative">
          {/* <h3 className="text-sm font-semibold text-center mb-1 text-gray-700">Simbol</h3> */}
          {symbols.map((item) => {
            const connected = isConnected(item.id, 'symbol')
            const isSelected = selectedSymbol === item.id
            const isCorrect = getConnectionResult(item.id, 'symbol')

            return (
              <button
                key={item.id}
                id={`symbol-${item.id}`}
                onClick={() => handleSymbolClick(item.id)}
                disabled={submitted}
                className={`p-1 rounded-lg flex items-center justify-center transition-all h-12 ${
                  submitted && connected
                    ? isCorrect
                      ? "bg-green-100 border-2 border-green-500"
                      : "bg-red-100 border-2 border-red-500"
                    : connected
                    ? "bg-blue-100 border-2 border-blue-500"
                    : isSelected
                    ? "bg-yellow-100 border-2 border-yellow-500"
                    : "bg-white border-2 border-gray-300 hover:border-blue-300"
                } ${submitted ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="w-8 h-8">{item.symbol}</div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 text-center">
        {!submitted ? (
          <div className="space-y-2">
            <div className="text-xs text-gray-600">
              Terhubung: {connections.length}/{quizItems.length}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                canSubmit
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Submit Jawaban
            </button>
          </div>
        ) : (
          <button
            onClick={resetQuiz}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
          >
            Coba Lagi
          </button>
        )}
      </div>
    </div>
  )
}