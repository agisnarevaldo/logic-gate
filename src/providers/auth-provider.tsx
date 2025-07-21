"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { createClient } from "@/utils/supabase/client"

interface AuthUser {
  id: string
  email?: string
  user_metadata?: {
    name?: string
    avatar_url?: string
  }
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const supabase = createClient()

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider: useEffect started')
    
    // Get initial session
    const getInitialSession = async () => {
      console.log('AuthProvider: Getting initial session...')
      try {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const { data: { session }, error } = await (supabase.auth as any).getSession()
        console.log('AuthProvider: Initial session result:', { 
          hasSession: !!session, 
          userId: session?.user?.id, 
          error: error?.message 
        })
        
        if (error) {
          console.error('AuthProvider: Error getting session:', error)
        }
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('AuthProvider: Exception getting session:', error)
        setUser(null)
      } finally {
        console.log('AuthProvider: Setting loading to false')
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    console.log('AuthProvider: Setting up auth state listener')
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange(
      (event: string, session: any) => {
        console.log(`AuthProvider: Auth event received - ${event}`, {
          hasSession: !!session,
          userId: session?.user?.id,
          currentPath: typeof window !== 'undefined' ? window.location.pathname : 'server'
        })
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Handle redirect after successful authentication
        if (session?.user && typeof window !== 'undefined') {
          const currentPath = window.location.pathname
          console.log('AuthProvider: User is authenticated, checking if redirect needed from:', currentPath)
          
          // Only redirect if on login page and user just signed in
          if (currentPath === '/login' && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            console.log('AuthProvider: Redirecting to dashboard')
            // Small delay to ensure state is properly set
            setTimeout(() => {
              window.location.replace('/dashboard')
            }, 100)
          }
        }
      }
    )

    return () => {
      console.log('AuthProvider: Cleaning up auth listener')
      subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    console.log('AuthProvider: Starting Google sign in...')
    try {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const redirectTo = `${window.location.origin}/api/auth/callback`
      console.log('AuthProvider: Redirect URL will be:', redirectTo)
      
      const { error } = await (supabase.auth as any).signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo
        }
      })
      
      console.log('AuthProvider: Google OAuth result:', { error: error?.message })
      return { error: error as Error | null }
    } catch (error) {
      console.error('AuthProvider: Exception during Google sign in:', error)
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    console.log('AuthProvider: Starting sign out...')
    try {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      await (supabase.auth as any).signOut()
      console.log('AuthProvider: Sign out successful')
    } catch (error) {
      console.error('AuthProvider: Error signing out:', error)
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
