'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export const updateParticipantAttendanceStatusToPresent = async (participantId: string) => {
  try {
    const payload = await getPayload({ config })

    // First, check if participant exists
    const participant = await payload.findByID({
      collection: 'participant',
      id: participantId,
    })

    if (!participant) {
      return {
        success: false,
        participant: null,
        error: 'Participant not found',
      }
    }

    // Update attendance status to present
    const updatedParticipant = await payload.update({
      collection: 'participant',
      id: participantId,
      data: {
        attendanceStatus: 'present',
        attendanceDate: new Date().toISOString(),
      },
    })

    return {
      success: true,
      participant: updatedParticipant,
      error: null,
    }
  } catch (error) {
    console.error('Error updating participant attendance:', error)
    return {
      success: false,
      participant: null,
      error: error instanceof Error ? error.message : 'Failed to update attendance',
    }
  }
}

export const getParticipantById = async (participantId: string) => {
  try {
    const payload = await getPayload({ config })

    const participant = await payload.findByID({
      collection: 'participant',
      id: participantId,
      depth: 2,
    })

    if (!participant) {
      return {
        success: false,
        participant: null,
        error: 'Participant not found',
      }
    }

    return {
      success: true,
      participant,
      error: null,
    }
  } catch (error) {
    console.error('Error fetching participant:', error)
    return {
      success: false,
      participant: null,
      error: error instanceof Error ? error.message : 'Failed to fetch participant',
    }
  }
}

export const getListParticipantsByEvent = async (
  eventId: string,
  options?: {
    page?: number
    limit?: number
    search?: string
    sort?: string
  },
) => {
  try {
    const payload = await getPayload({ config })
    const { page = 1, limit = 10, search = '', sort = '-createdAt' } = options || {}

    const where: any = {
      event: {
        equals: eventId,
      },
    }

    // Add search filter if provided
    if (search) {
      where.and = [
        {
          event: {
            equals: eventId,
          },
        },
        {
          or: [
            {
              fullName: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
              },
            },
            {
              phoneNumber: {
                contains: search,
              },
            },
          ],
        },
      ]
    }

    const result = await payload.find({
      collection: 'participant',
      where,
      limit,
      page,
      sort,
    })

    // Calculate statistics
    const allParticipants = await payload.find({
      collection: 'participant',
      where: {
        event: {
          equals: eventId,
        },
      },
      limit: 1000,
    })

    const totalParticipants = allParticipants.totalDocs
    const presentParticipants = allParticipants.docs.filter(
      (p: any) => p.attendanceStatus === 'present',
    ).length
    const presentPercentage =
      totalParticipants > 0 ? Math.round((presentParticipants / totalParticipants) * 100) : 0

    return {
      success: true,
      data: result,
      stats: {
        totalParticipants,
        presentParticipants,
        presentPercentage,
      },
      error: null,
    }
  } catch (error) {
    console.error('Error fetching participants:', error)
    return {
      success: false,
      data: null,
      stats: null,
      error: error instanceof Error ? error.message : 'Failed to fetch participants',
    }
  }
}
