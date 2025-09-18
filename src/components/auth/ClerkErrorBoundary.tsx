'use client'

import { Component, ReactNode, useState, useEffect } from 'react'
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { publishableKey, clerkConfig } from '@/lib/clerk'

interface ClerkErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ClerkErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

class ClerkErrorBoundary extends Component<ClerkErrorBoundaryProps, ClerkErrorBoundaryState> {
  constructor(props: ClerkErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ClerkErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Clerk Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Loading Issue</h2>
            <p className="text-gray-600 mb-4">
              We're experiencing trouble loading authentication services. This is usually temporary.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Reload Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
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

function ClerkErrorHandler({ children }: { children: ReactNode }) {
  const { isLoaded } = useAuth()
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Handle Clerk errors manually
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('clerk')) {
        console.error('Clerk authentication error:', event.message)
        setError(new Error(event.message))
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Loading authentication...</span>
      </div>
    )
  }

  if (error) {
    console.error('Clerk authentication error:', error)
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 m-4">
        <p className="text-sm text-yellow-800">
          Authentication service temporarily unavailable. Some features may be limited.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

export function SafeClerkProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={clerkConfig.appearance}
      routerPush={(to) => window.location.href = to}
      routerReplace={(to) => window.location.replace(to)}
    >
      <ClerkErrorBoundary>
        <ClerkErrorHandler>
          {children}
        </ClerkErrorHandler>
      </ClerkErrorBoundary>
    </ClerkProvider>
  )
}