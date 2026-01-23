'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AuthCallbackPage() {
    const [status, setStatus] = useState('Processing authentication...')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const supabase = createClient()

                // Get the code from URL
                const urlParams = new URLSearchParams(window.location.search)
                const code = urlParams.get('code')
                const errorParam = urlParams.get('error')
                const errorDescription = urlParams.get('error_description')
                const next = urlParams.get('next') || '/dashboard'

                console.log('AuthCallback: Processing callback', { hasCode: !!code, error: errorParam })

                if (errorParam) {
                    setError(errorDescription || errorParam)
                    setTimeout(() => {
                        window.location.href = `/login?error=${encodeURIComponent(errorDescription || errorParam)}`
                    }, 2000)
                    return
                }

                if (code) {
                    setStatus('Exchanging code for session...')

                    // Exchange code for session - this will set cookies in the browser context
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    const { data, error: exchangeError } = await (supabase.auth as any).exchangeCodeForSession(code)

                    console.log('AuthCallback: Exchange result', {
                        success: !exchangeError,
                        hasUser: !!data?.user,
                        userId: data?.user?.id
                    })

                    if (exchangeError) {
                        console.error('AuthCallback: Exchange error', exchangeError)
                        setError(exchangeError.message)
                        setTimeout(() => {
                            window.location.href = `/login?error=${encodeURIComponent(exchangeError.message)}`
                        }, 2000)
                        return
                    }

                    if (data?.user) {
                        setStatus('Login successful! Redirecting...')

                        // Verify session is now available
                        const { data: sessionData } = await (supabase.auth as any).getSession()
                        console.log('AuthCallback: Session after exchange', { hasSession: !!sessionData?.session })

                        // Redirect to dashboard
                        setTimeout(() => {
                            window.location.href = next
                        }, 500)
                    } else {
                        setError('Authentication successful but no user data received')
                        setTimeout(() => {
                            window.location.href = '/login?error=No user data'
                        }, 2000)
                    }
                } else {
                    setError('No authorization code found')
                    setTimeout(() => {
                        window.location.href = '/login?error=No code'
                    }, 2000)
                }
            } catch (err) {
                console.error('AuthCallback: Exception', err)
                const message = err instanceof Error ? err.message : 'Unknown error'
                setError(message)
                setTimeout(() => {
                    window.location.href = `/login?error=${encodeURIComponent(message)}`
                }, 2000)
            }
        }

        handleCallback()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                {error ? (
                    <>
                        <div className="text-red-500 text-xl mb-4">❌</div>
                        <h1 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h1>
                        <p className="text-gray-600">{error}</p>
                        <p className="text-sm text-gray-400 mt-4">Redirecting to login...</p>
                    </>
                ) : (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tertiary mx-auto mb-4"></div>
                        <h1 className="text-xl font-semibold text-gray-800 mb-2">{status}</h1>
                        <p className="text-gray-500 text-sm">Please wait...</p>
                    </>
                )}
            </div>
        </div>
    )
}
