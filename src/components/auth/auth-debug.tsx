"use client"

import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

export function AuthDebug() {
  const { user, loading } = useAuth()

  useEffect(() => {
    console.log('Auth Debug:', { user, loading })
  }, [user, loading])

  if (loading) {
    return <div className="text-sm text-gray-500">Loading auth...</div>
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-2 rounded text-xs max-w-xs">
      <strong>Auth Status:</strong>
      <br />
      User: {user ? user.email : 'Not logged in'}
      <br />
      Loading: {loading.toString()}
    </div>
  )
}
