'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { getUserFromToken } from '@/lib/jwt-utils'

export const getDashboardStats = async () => {
  try {
    const payload = await getPayload({
      config,
    })

    // Get total users count
    const usersResult = await payload.find({
      collection: 'users',
      limit: 0,
    })

    // Get total events count
    const eventsResult = await payload.find({
      collection: 'event',
      limit: 0,
    })

    // Get upcoming events
    const upcomingEventsResult = await payload.find({
      collection: 'event',
      where: {
        date: {
          greater_than_equal: new Date().toISOString(),
        },
      },
      limit: 5,
      sort: 'date',
    })

    return {
      success: true,
      stats: {
        totalUsers: usersResult.totalDocs,
        totalEvents: eventsResult.totalDocs,
        upcomingEvents: upcomingEventsResult.docs,
      },
      error: null,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      success: false,
      stats: null,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
    }
  }
}

export const getCurrentUser = async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')

    if (!token) {
      return {
        success: false,
        user: null,
        error: 'Not authenticated',
      }
    }

    const decodedToken = await getUserFromToken(token.value)

    if (!decodedToken) {
      return {
        success: false,
        user: null,
        error: 'Invalid token',
      }
    }

    const payload = await getPayload({ config })
    const user = await payload.findByID({
      collection: 'users',
      id: decodedToken.id,
    })

    return {
      success: true,
      user,
      error: null,
    }
  } catch (error) {
    console.error('Error fetching current user:', error)
    return {
      success: false,
      user: null,
      error: error instanceof Error ? error.message : 'Failed to fetch user',
    }
  }
}

export const updateUserSettings = async (data: { email: string }) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')

    if (!token) {
      return {
        success: false,
        user: null,
        error: 'Tidak terautentikasi',
      }
    }

    const decodedToken = await getUserFromToken(token.value)

    if (!decodedToken) {
      return {
        success: false,
        user: null,
        error: 'Token tidak valid',
      }
    }

    const payload = await getPayload({ config })

    // Check if email is already taken by another user
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: data.email,
        },
        id: {
          not_equals: decodedToken.id,
        },
      },
    })

    if (existingUser.docs.length > 0) {
      return {
        success: false,
        user: null,
        error: 'Email sudah digunakan oleh pengguna lain',
      }
    }

    const updatedUser = await payload.update({
      collection: 'users',
      id: decodedToken.id,
      data: {
        email: data.email,
      },
    })

    return {
      success: true,
      user: updatedUser,
      error: null,
    }
  } catch (error) {
    console.error('Error updating user settings:', error)
    return {
      success: false,
      user: null,
      error: error instanceof Error ? error.message : 'Gagal memperbarui pengaturan',
    }
  }
}
