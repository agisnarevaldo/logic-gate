/**
 * Environment configuration utility
 * Handles different environments (development/production)
 */

export const getEnvironment = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'
  
  return {
    isDevelopment,
    isProduction,
    nodeEnv: process.env.NODE_ENV || 'development',
  }
}

export const getBaseURL = () => {
  // Client-side detection
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Server-side detection
  const env = getEnvironment()
  
  // Production environment
  if (env.isProduction) {
    return process.env.NEXT_PUBLIC_SITE_URL || 'https://logic-gate-sooty.vercel.app'
  }
  
  // Development environment
  return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export const getAuthRedirectURL = (path: string = '/auth/callback') => {
  const baseURL = getBaseURL()
  return `${baseURL}${path}`
}

export const getAuthConfig = () => {
  const baseURL = getBaseURL()
  const env = getEnvironment()
  
  return {
    baseURL,
    redirectURL: getAuthRedirectURL(),
    isDevelopment: env.isDevelopment,
    isProduction: env.isProduction,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }
}
