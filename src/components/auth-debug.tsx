"use client"

import { auth } from "@/lib/auth"
import { getAuthConfig } from "@/lib/env-config"
import { useState } from "react"

export function AuthDebugInfo() {
  const [authConfig] = useState(() => getAuthConfig())
  
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await auth.signInWithGoogle('/game')
      if (error) {
        console.error('Sign in error:', error)
        alert(`Sign in error: ${error.message}`)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('Unexpected error during sign in')
    }
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-sm">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <p><strong>Environment:</strong> {authConfig.isDevelopment ? 'Development' : 'Production'}</p>
        <p><strong>Base URL:</strong> {authConfig.baseURL}</p>
        <p><strong>Redirect URL:</strong> {authConfig.redirectURL}</p>
        <p><strong>Node ENV:</strong> {process.env.NODE_ENV}</p>
      </div>
      
      <button 
        onClick={handleGoogleSignIn}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Test Google Sign In
      </button>
      
      {authConfig.isDevelopment && (
        <p className="text-xs text-orange-600 mt-2">
          🔧 Development mode - using localhost URLs
        </p>
      )}
    </div>
  )
}
