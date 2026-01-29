'use client'

import { getMeUser } from '@/lib/data/user'
import { User } from '@/payload-types'
import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  setUser: (user: User | null) => void
  triggerRefresh: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const path = usePathname()
  const triggerRefresh = useCallback(() => {
    fetchSession()
  }, [])

  const fetchSession = useCallback(async () => {
    console.log('[AUTH PROVIDER] Fetching session data...')

    setLoading(true)
    setError(null)

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/change-password']
    const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(route + '/'))

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard']
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

    try {
      const result = await getMeUser()
      console.log('[AUTH PROVIDER] Session result:', {
        hasToken: !!result.token,
        hasUser: !!result.user,
        userId: result.user?.id,
        path,
        isPublicRoute,
        isProtectedRoute,
      })

      if (result.user) {
        setUser(result.user)
        console.log('[AUTH PROVIDER] User set:', result.user.id)
      } else {
        setUser(null)
        // Only redirect to login if accessing protected route without user
        if (isProtectedRoute && !isPublicRoute) {
          router.push(`/login?redirect=${encodeURIComponent(path)}`)
        }
        console.log('[AUTH PROVIDER] No user found')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch session'
      console.error('[AUTH PROVIDER] Error fetching session:', err)
      // Only redirect to login if accessing protected route without user
      if (isProtectedRoute && !isPublicRoute) {
        router.push(`/login?redirect=${encodeURIComponent(path)}`)
      }
      setError(errorMessage)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [path, router])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  const value: AuthContextType = useMemo(
    () => ({
      user,
      loading,
      error,
      refetch: fetchSession,
      setUser,
      triggerRefresh,
    }),
    [user, loading, error, fetchSession, triggerRefresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 */
export function useSession(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useSession must be used within an AuthProvider')
  }

  return context
}
