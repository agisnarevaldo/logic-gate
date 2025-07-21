/**
 * Utility functions for handling Supabase authentication
 */

import { supabase } from '@/lib/supabase'

export function clearSupabaseSession() {
  if (typeof window !== 'undefined') {
    // Clear Supabase session
    localStorage.removeItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '') + '-auth-token')
    
    try {
      // Clear other potential storage items
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.clear()
    } catch (e) {
      console.log('Could not clear storage:', e)
    }
  }
}

export async function getCurrentSession() {
  try {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const { data: { session }, error } = await (supabase.auth as any).getSession()
    if (error) {
      console.error('Get session error:', error)
      return null
    }
    return session
  } catch (error) {
    console.error('Get session failed:', error)
    return null
  }
}

export function handleAuthError(error: Error | { message?: string } | unknown) {
  console.log('Auth error detected:', (error as Error)?.message || error)
  
  if (typeof window !== 'undefined') {
    // Check if it's a session error
    const errorMessage = (error as Error)?.message || ''
    if (errorMessage.includes('session') || errorMessage.includes('auth')) {
      console.log('Session error detected, clearing corrupted session...')
      clearSupabaseSession()
      
      // Redirect to login
      window.location.href = '/login'
      return true
    }
  }
  
  return false
}
