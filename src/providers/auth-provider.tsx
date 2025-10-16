"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { createClient } from "@/utils/supabase/client"

interface AuthUser {
  id: string
  email?: string
  role?: 'student' | 'teacher'
  user_metadata?: {
    name?: string
    avatar_url?: string
  }
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  isTeacher: boolean
  isStudent: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const supabase = createClient()

// Helper function to enrich user with profile data including role
const enrichUserWithProfile = async (authUser: { id: string; email?: string; user_metadata?: { name?: string; avatar_url?: string } } | null | undefined): Promise<AuthUser> => {
  // Early return with default user if authUser is invalid
  if (!authUser || !authUser.id) {
    console.warn('enrichUserWithProfile: Invalid or missing auth user object:', authUser)
    return {
      id: authUser?.id || crypto.randomUUID(), // Generate fallback ID
      email: authUser?.email || '',
      role: 'student',
      user_metadata: authUser?.user_metadata || {}
    }
  }

  try {
    // Double check supabase is available
    if (!supabase) {
      console.error('enrichUserWithProfile: Supabase client not available')
      return {
        id: authUser.id,
        email: authUser.email,
        role: 'student',
        user_metadata: authUser.user_metadata || {}
      }
    }

    // Attempt to fetch profile with timeout protection
    const profileQuery = supabase
      .from('user_profiles')
      .select('role, full_name, avatar_url')
      .eq('id', authUser.id)
      .single()

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) => {
      setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
    })

    let profile: { role?: 'student' | 'teacher'; full_name?: string; avatar_url?: string } | null = null
    let error: Error | null = null

    try {
      const result = await Promise.race([
        profileQuery,
        timeoutPromise
      ])
      profile = result.data
      error = result.error
    } catch (timeoutError) {
      console.warn('enrichUserWithProfile: Timeout or other error:', timeoutError)
      error = timeoutError as Error
    }

    if (error) {
      console.warn('enrichUserWithProfile: Profile fetch error:', error.message)

      // Smart fallback: detect role based on email
      const fallbackRole = authUser.email?.includes('guru') ? 'teacher' : 'student'
      console.log('enrichUserWithProfile: Using email-based role detection:', fallbackRole)

      return {
        id: authUser.id,
        email: authUser.email,
        role: fallbackRole,
        user_metadata: authUser.user_metadata || {}
      }
    }

    // Successfully got profile data
    // Return enriched user with smart role detection
    const detectedRole = profile?.role || (authUser.email?.includes('guru') ? 'teacher' : 'student')
    console.log('enrichUserWithProfile: Success case role detection:', { profileRole: profile?.role, detectedRole, email: authUser.email })

    return {
      id: authUser.id,
      email: authUser.email,
      role: detectedRole,
      user_metadata: {
        name: profile?.full_name || authUser.user_metadata?.name || '',
        avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url || ''
      }
    }

  } catch (error) {
    console.error('enrichUserWithProfile: Exception occurred:', error)

    // Smart fallback: detect role based on email even in exception case
    const fallbackRole = authUser.email?.includes('guru') ? 'teacher' : 'student'
    console.log('enrichUserWithProfile: Exception fallback role:', fallbackRole)

    // Always return a valid user object, never throw
    return {
      id: authUser.id,
      email: authUser.email || '',
      role: fallbackRole,
      user_metadata: authUser.user_metadata || {}
    }
  }
}

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
          setUser(null)
          return
        }

        if (session?.user) {
          // Fetch user profile to get role
          try {
            const enrichedUser = await enrichUserWithProfile(session.user)
            setUser(enrichedUser)
          } catch (enrichError) {
            console.error('AuthProvider: Error enriching user:', enrichError)
            // Fallback to basic user without profile
            setUser({
              id: session.user.id,
              email: session.user.email,
              role: 'student',
              user_metadata: session.user.user_metadata
            })
          }
        } else {
          setUser(null)
        }
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
      async (event: string, session: any) => {
        console.log(`AuthProvider: Auth event received - ${event}`, {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          currentPath: typeof window !== 'undefined' ? window.location.pathname : 'server'
        })

        if (session?.user) {
          try {
            // Safely enrich user profile
            const enrichedUser = await enrichUserWithProfile(session.user)
            setUser(enrichedUser)

            // Handle redirect after successful authentication
            if (typeof window !== 'undefined') {
              const currentPath = window.location.pathname
              console.log('AuthProvider: User authenticated, current path:', currentPath, 'role:', enrichedUser.role)

              // Redirect on sign in events from login-related pages
              if (currentPath === '/login' || currentPath === '/' || currentPath === '/signup') {
                if (event === 'SIGNED_IN') {
                  console.log('AuthProvider: New sign in detected, redirecting based on role:', enrichedUser.role)
                  setTimeout(() => {
                    try {
                      if (enrichedUser.role === 'teacher') {
                        console.log('AuthProvider: Redirecting teacher to /guru')
                        window.location.replace('/guru')
                      } else {
                        console.log('AuthProvider: Redirecting student to /dashboard')
                        window.location.replace('/dashboard')
                      }
                    } catch (redirectError) {
                      console.error('AuthProvider: Redirect error:', redirectError)
                    }
                  }, 150)
                } else if (event === 'TOKEN_REFRESHED' && currentPath === '/login') {
                  console.log('AuthProvider: Token refreshed on login page, redirecting based on role:', enrichedUser.role)
                  setTimeout(() => {
                    try {
                      if (enrichedUser.role === 'teacher') {
                        window.location.replace('/guru')
                      } else {
                        window.location.replace('/dashboard')
                      }
                    } catch (redirectError) {
                      console.error('AuthProvider: Redirect error:', redirectError)
                    }
                  }, 100)
                }
              }
            }
          } catch (enrichError) {
            console.error('AuthProvider: Critical error enriching user:', enrichError)
            // Set basic fallback user to prevent app crash
            try {
              setUser({
                id: session.user?.id || crypto.randomUUID(),
                email: session.user?.email || '',
                role: 'student',
                user_metadata: session.user?.user_metadata || {}
              })
            } catch (fallbackError) {
              console.error('AuthProvider: Fallback user creation failed:', fallbackError)
              setUser(null)
            }
          }
        } else {
          setUser(null)
        }
        setLoading(false)
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

      const { data, error } = await (supabase.auth as any).signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      console.log('AuthProvider: Google OAuth result:', {
        error: error?.message,
        hasData: !!data,
        provider: data?.provider,
        url: data?.url
      })

      return { error: error as Error | null }
    } catch (error) {
      console.error('AuthProvider: Exception during Google sign in:', error)
      return { error: error as Error }
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    console.log('AuthProvider: Starting email sign in...')
    try {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const { data, error } = await (supabase.auth as any).signInWithPassword({
        email,
        password
      })

      console.log('AuthProvider: Email sign in result:', {
        error: error?.message,
        hasUser: !!data?.user
      })

      return { error: error as Error | null }
    } catch (error) {
      console.error('AuthProvider: Exception during email sign in:', error)
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    console.log('AuthProvider: Starting sign out...')
    try {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const { error } = await (supabase.auth as any).signOut()
      if (error) {
        console.error('AuthProvider: Sign out error:', error)
        throw error
      }

      console.log('AuthProvider: Sign out successful')

      // Clear user state immediately
      setUser(null)

      // Clear localStorage/sessionStorage if needed
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()

        // Force reload to clear all state
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('AuthProvider: Error signing out:', error)
      // Even if signOut fails, clear local state and redirect
      setUser(null)
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  const isTeacher = user?.role === 'teacher'
  const isStudent = user?.role === 'student'

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    isTeacher,
    isStudent
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
