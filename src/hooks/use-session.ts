'use client'
import { getMeUser } from '@/lib/data/user'
import { User } from '@/payload-types'
import { useEffect, useState } from 'react'

interface UseSessionReturn {
  user: User | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export default function useSession(): UseSessionReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSession = async () => {
    console.log('[USE SESSION] Fetching session data...')
    setLoading(true)
    setError(null)

    try {
      const result = await getMeUser()
      console.log('[USE SESSION] Session result:', {
        hasToken: !!result.token,
        hasUser: !!result.user,
        userId: result.user?.id,
      })

      if (result.user) {
        setUser(result.user)
        console.log('[USE SESSION] User set:', result.user.id)
      } else {
        setUser(null)
        console.log('[USE SESSION] No user found')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch session'
      console.error('[USE SESSION] Error fetching session:', err)
      setError(errorMessage)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, []) // Only fetch once on mount

  return {
    user,
    loading,
    error,
    refetch: fetchSession,
  }
}
