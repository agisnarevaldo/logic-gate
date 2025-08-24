"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signInWithGoogle, user, loading } = useAuth()

  console.log('LoginForm: Rendering with state:', { 
    isLoading, 
    hasUser: !!user, 
    userId: user?.id,
    authLoading: loading
  })

  // If user is authenticated and we're on login page, they should be redirected
  useEffect(() => {
    console.log('LoginForm: useEffect - user state changed', {
      hasUser: !!user,
      currentPath: window.location.pathname
    })
    if (user && window.location.pathname === '/login') {
      console.log('LoginForm: User is logged in on login page, should be redirected...')
    }
  }, [user])

  const handleGoogleSignIn = async () => {
    console.log('LoginForm: Google sign in button clicked')
    setIsLoading(true)
    setError("")
    
    try {
      console.log('LoginForm: Calling signInWithGoogle...')
      const { error } = await signInWithGoogle()
      console.log('LoginForm: signInWithGoogle returned:', { hasError: !!error, errorMsg: error?.message })
      
      if (error) {
        console.error('LoginForm: Google sign in error:', error)
        setError("Google sign in failed. Please try again.")
        setIsLoading(false)
      } else {
        console.log('LoginForm: Google sign in initiated successfully, waiting for redirect...')
        // Keep loading state - callback route will handle redirect
      }
    } catch (err) {
      console.error('LoginForm: Exception during Google sign in:', err)
      setError("Something went wrong with Google sign in")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-tertiary mb-8">LogiFun</h1>
        {/* <h2 className="text-2xl font-medium mb-8">Login to your Account</h2> */}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="text-center">
        <p className="text-muted-foreground text-sm mb-6">Sign in with your Google account</p>
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 w-full p-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isLoading && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
                fill="#4285F4"
              />
              <path
                d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.72 16.69 5.82 14.09H2.12V16.95C3.94 20.57 7.69 23 12 23Z"
                fill="#34A853"
              />
              <path
                d="M5.82 14.09C5.6 13.43 5.48 12.73 5.48 12C5.48 11.27 5.6 10.57 5.82 9.91V7.05H2.12C1.41 8.57 1 10.24 1 12C1 13.76 1.41 15.43 2.12 16.95L5.82 14.09Z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.37C13.62 5.37 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.69 1 3.94 3.43 2.12 7.05L5.82 9.91C6.72 7.31 9.13 5.37 12 5.37Z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span className="text-lg font-medium">
            {isLoading ? "Signing in..." : "Continue with Google"}
          </span>
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <a href="#" className="text-tertiary hover:text-tertiary/90">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-tertiary hover:text-tertiary/90">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
