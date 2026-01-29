'use server'

import { User } from '@/payload-types'
import { LoginFormSchema } from '../types/login-form-schema'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { ForgotPasswordSchema } from '../types/forgot-password-schema'

/**
 * Authenticates User with email and password
 * Sets payload-token cookie on success
 * Returns User data and token, or error message on failure
 */
export const login = async (
  form: LoginFormSchema,
): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
  console.log('[LOGIN] Starting login process for:', form.email)

  try {
    const payload = await getPayload({ config })
    console.log('[LOGIN] Payload instance obtained')

    const result = await payload.login({
      collection: 'users',
      data: {
        email: form.email,
        password: `${form.password}`,
      },
    })

    console.log('[LOGIN] Login result:', {
      hasToken: !!result.token,
      hasUser: !!result.user,
      userId: result.user?.id,
    })

    if (!result.token || !result.user) {
      console.log('[LOGIN] Login failed: missing token or user')
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('payload-token', result.token as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    console.log('[LOGIN] Cookie set successfully for user:', result.user.id)

    return {
      success: true,
      user: result.user as User,
      token: result.token,
    }
  } catch (error) {
    console.error('[LOGIN] Login error:', error)
    console.error('[LOGIN] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    }
  }
}

/**
 * Logs out the current User by deleting the payload-token cookie
 * Returns success status
 */
export const logout = async (): Promise<{ success: boolean }> => {
  console.log('[LOGOUT] Logging out user')

  try {
    const cookieStore = await cookies()
    cookieStore.delete('payload-token')

    console.log('[LOGOUT] Cookie deleted successfully')

    return {
      success: true,
    }
  } catch (error) {
    console.error('[LOGOUT] Error during logout:', error)

    return {
      success: false,
    }
  }
}

/**
 * Initiates forgot password flow by sending reset email
 * Returns success status and message
 */
export const forgotPassword = async (
  form: ForgotPasswordSchema,
): Promise<{ success: boolean; message: string }> => {
  try {
    const payload = await getPayload({ config })

    await payload.forgotPassword({
      collection: 'users',
      data: {
        email: form.email,
      },
    })

    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send reset email',
    }
  }
}
