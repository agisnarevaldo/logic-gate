"use client"

import { useState } from 'react'
import { debugAcademicSystem } from '@/utils/debug-academic'

export function DebugAcademicPanel() {
  const [isDebugging, setIsDebugging] = useState(false)
  const [debugOutput, setDebugOutput] = useState<string[]>([])

  const runDebug = async () => {
    setIsDebugging(true)
    setDebugOutput([])
    
    // Capture console.log output
    const originalLog = console.log
    const originalError = console.error
    const logs: string[] = []
    
    console.log = (...args) => {
      logs.push(`[LOG] ${args.join(' ')}`)
      originalLog(...args)
    }
    
    console.error = (...args) => {
      logs.push(`[ERROR] ${args.join(' ')}`)
      originalError(...args)
    }
    
    try {
      await debugAcademicSystem()
    } catch (error) {
      logs.push(`[CRITICAL ERROR] ${error}`)
    }
    
    // Restore console functions
    console.log = originalLog
    console.error = originalError
    
    setDebugOutput(logs)
    setIsDebugging(false)
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg max-w-4xl mx-auto">
      <h3 className="text-lg font-bold mb-4">🔧 Academic System Debugger</h3>
      
      <button
        onClick={runDebug}
        disabled={isDebugging}
        className={`px-4 py-2 rounded-lg font-medium ${
          isDebugging 
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isDebugging ? '🔄 Running Debug...' : '🚀 Run Debug Test'}
      </button>
      
      {debugOutput.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Debug Output:</h4>
          <div className="bg-black text-green-400 p-3 rounded text-sm font-mono max-h-96 overflow-y-auto">
            {debugOutput.map((log, index) => (
              <div key={index} className={`mb-1 ${
                log.includes('[ERROR]') ? 'text-red-400' : 
                log.includes('[CRITICAL ERROR]') ? 'text-red-600 font-bold' :
                log.includes('✅') ? 'text-green-400' :
                log.includes('❌') ? 'text-red-400' :
                log.includes('⚠️') ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
