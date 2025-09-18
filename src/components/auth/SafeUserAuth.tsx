'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserButton, useUser, useAuth, SignInButton } from '@clerk/nextjs'
import { User, LogIn, RefreshCw, AlertTriangle } from 'lucide-react'

interface ClerkErrorInfo {
  message: string
  timestamp: number
  retryCount: number
}

export default function SafeUserAuth() {
  const { user, isLoaded: userLoaded } = useUser()
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const [showError, setShowError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorInfo, setErrorInfo] = useState<ClerkErrorInfo | null>(null)
  const [clerkInitialized, setClerkInitialized] = useState(false)

  // Enhanced error detection for chunk loading issues
  const handleError = useCallback((event: ErrorEvent | Event) => {
    const message = 'message' in event ? event.message : ''
    const target = 'target' in event ? event.target : null

    if (
      message?.includes('Loading chunk') &&
      (message?.includes('clerk') || message?.includes('framework_clerk'))
    ) {
      console.error('Clerk chunk loading error detected:', message)

      const newErrorInfo: ClerkErrorInfo = {
        message,
        timestamp: Date.now(),
        retryCount: retryCount + 1
      }

      setErrorInfo(newErrorInfo)
      setShowError(true)

      // Attempt to recover by reloading Clerk
      setTimeout(() => {
        try {
          window.location.reload()
        } catch (error) {
          console.error('Failed to reload page:', error)
        }
      }, 3000)
    }

    // Handle resource loading errors
    if (target instanceof HTMLScriptElement && target.src?.includes('clerk')) {
      console.error('Clerk script loading error:', target.src)
      setShowError(true)
    }
  }, [retryCount])

  // Initialize Clerk with error handling
  useEffect(() => {
    // Check for Clerk chunk loading errors
    window.addEventListener('error', handleError)

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('clerk')) {
        console.error('Clerk promise rejection:', event.reason)
        setShowError(true)
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Check if Clerk is already loaded
    const checkClerkLoaded = () => {
      if (typeof window !== 'undefined' && (window as any).Clerk) {
        setClerkInitialized(true)
        setIsLoading(false)
      }
    }

    // Check immediately and then periodically
    checkClerkLoaded()
    const interval = setInterval(checkClerkLoaded, 100)

    // Timeout for Clerk initialization
    const timeout = setTimeout(() => {
      clearInterval(interval)
      if (!clerkInitialized) {
        console.warn('Clerk initialization timeout')
        setShowError(true)
        setIsLoading(false)
      }
    }, 10000) // 10 second timeout

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [handleError, clerkInitialized])

  // Enhanced retry mechanism
  useEffect(() => {
    if (retryCount < 3 && !authLoaded && !userLoaded && !showError) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1)
        console.log(`Clerk retry attempt ${retryCount + 1}`)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [authLoaded, userLoaded, retryCount, showError])

  // Manual retry function
  const handleRetry = useCallback(() => {
    console.log('Manual retry triggered')
    setShowError(false)
    setErrorInfo(null)
    setRetryCount(0)
    setIsLoading(true)

    // Force reload Clerk
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }, [])

  // Force reload function
  const handleForceReload = useCallback(() => {
    console.log('Force reload triggered')
    window.location.reload() // Force reload from server
  }, [])

  if (showError) {
    return (
      <div className="flex items-center space-x-3">
        <div className="bg-red-50 border border-red-200 rounded-md p-3 max-w-xs">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Authentication Issue</span>
          </div>
          <p className="text-xs text-red-700 mb-2">
            {errorInfo?.message || 'Authentication service temporarily unavailable'}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleRetry}
              className="flex items-center space-x-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </button>
            <button
              onClick={handleForceReload}
              className="text-xs text-red-600 hover:text-red-800 underline"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!authLoaded || !userLoaded || isLoading) {
    if (retryCount >= 3) {
      return (
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 rounded-full p-2">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-sm text-gray-500">
            <span>Authentication loading...</span>
            <button
              onClick={handleRetry}
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              retry
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">
          {retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'Loading auth...'}
        </span>
      </div>
    )
  }

  if (isSignedIn && user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="text-sm text-gray-700">
          Welcome, {user.firstName || user.username || 'Trader'}
        </div>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "w-8 h-8",
              userButtonBox: "hover:bg-gray-100"
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <SignInButton mode="modal">
        <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
          <LogIn className="h-4 w-4" />
          <span>Sign In</span>
        </button>
      </SignInButton>
    </div>
  )
}