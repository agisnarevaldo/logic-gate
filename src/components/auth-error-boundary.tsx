"use client"

import React from 'react'

interface AuthErrorBoundaryState {
    hasError: boolean
    error?: Error
}

interface AuthErrorBoundaryProps {
    children: React.ReactNode
}

export class AuthErrorBoundary extends React.Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
    constructor(props: AuthErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
        console.error('AuthErrorBoundary: Error caught:', error)
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('AuthErrorBoundary: Error details:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full mx-auto px-4">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="text-red-500 mb-4">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
                            <p className="text-gray-600 mb-4">
                                Something went wrong with the authentication process. Please try again.
                            </p>
                            <button
                                onClick={() => {
                                    this.setState({ hasError: false })
                                    window.location.href = '/login'
                                }}
                                className="bg-tertiary text-white px-4 py-2 rounded-md hover:bg-tertiary/90 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
