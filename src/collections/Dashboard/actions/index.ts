'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

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
