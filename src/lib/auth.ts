import { supabase } from './supabase'

// Auth utilities untuk Supabase
export const auth = {
  // Sign up dengan email dan password
  async signUp(email: string, password: string, userData?: { name?: string }) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const { data, error } = await (supabase.auth as any).signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in dengan email dan password
  async signIn(email: string, password: string) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const { data, error } = await (supabase.auth as any).signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign in dengan Google
  async signInWithGoogle() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const { data, error } = await (supabase.auth as any).signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const { error } = await (supabase.auth as any).signOut()
    return { error }
  },

  // Get current user
  async getUser(): Promise<any> {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const { data: { user } } = await (supabase.auth as any).getUser()
    return user
  },

  // Get session
  async getSession() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const { data: { session } } = await (supabase.auth as any).getSession()
    return session
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (supabase.auth as any).onAuthStateChange(callback)
  }
}

// Type definitions
export interface AuthUser {
  id: string
  email?: string
  name?: string
  avatar_url?: string
}
