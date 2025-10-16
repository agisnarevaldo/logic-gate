"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showTeacherLogin, setShowTeacherLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signInWithGoogle, signInWithEmail, user, loading } = useAuth()

  console.log('LoginForm: Rendering with state:', {
    isLoading,
    hasUser: !!user,
    userId: user?.id,
    authLoading: loading
  })

  // Check for error in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    if (errorParam) {
      console.log('LoginForm: Error from URL params:', errorParam)
      setError(decodeURIComponent(errorParam))
      // Clean up URL
      const url = new URL(window.location.href)
      url.searchParams.delete('error')
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  // If user is authenticated and we're on login page, they should be redirected
  useEffect(() => {
    console.log('LoginForm: useEffect - user state changed', {
      hasUser: !!user,
      userRole: user?.role,
      currentPath: window.location.pathname
    })

    if (user && (window.location.pathname === '/login' || window.location.pathname === '/')) {
      const targetPath = user.role === 'teacher' ? '/guru' : '/dashboard'
      console.log('LoginForm: User is logged in, redirecting to:', targetPath)

      // Small delay to allow AuthProvider to handle first
      setTimeout(() => {
        window.location.replace(targetPath)
      }, 200)
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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('LoginForm: Email sign in form submitted')
    setIsLoading(true)
    setError("")

    try {
      const { error } = await signInWithEmail(email, password)

      if (error) {
        console.error('LoginForm: Email sign in error:', error)
        setError("Invalid email or password. Please try again.")
        setIsLoading(false)
      } else {
        console.log('LoginForm: Email sign in successful')
        // Don't set loading to false here - let the redirect happen
        // AuthProvider will handle redirect based on role

        // Fallback redirect if AuthProvider doesn't handle it
        setTimeout(() => {
          if (isLoading) {
            console.log('LoginForm: Fallback redirect triggered')
            setIsLoading(false)
            // AuthProvider should have set user by now, but double-check
            if (user?.role === 'teacher') {
              window.location.replace('/guru')
            } else {
              window.location.replace('/dashboard')
            }
          }
        }, 1000)
      }
    } catch (err) {
      console.error('LoginForm: Exception during email sign in:', err)
      setError("Something went wrong. Please try again.")
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

      {!showTeacherLogin ? (
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-6">Sign in with your Google account</p>
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 w-full p-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-4"
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div>

          <button
            onClick={() => setShowTeacherLogin(true)}
            className="w-full p-3 text-tertiary border border-tertiary rounded-md hover:bg-tertiary hover:text-white transition-colors"
          >
            Login sebagai Guru
          </button>
        </div>
      ) : (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Login Guru</h2>
            <p className="text-sm text-gray-600">Masukkan email dan password Anda</p>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-tertiary focus:border-transparent"
                placeholder="guru@logifun.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-tertiary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 bg-tertiary text-white rounded-md hover:bg-tertiary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setShowTeacherLogin(false)}
              className="text-sm text-tertiary hover:underline"
            >
              ← Kembali ke login siswa
            </button>
          </div>
        </div>
      )}

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
