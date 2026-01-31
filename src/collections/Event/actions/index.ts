'use server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const getListEvents = async (options?: {
  page?: number
  limit?: number
  search?: string
  sort?: string
}) => {
  const payload = await getPayload({
    config,
  })

  const { page = 1, limit = 10, search = '', sort = '-createdAt' } = options || {}

  const where: any = {}

  // Add search filter if provided
  if (search) {
    where.or = [
      {
        name: {
          contains: search,
        },
      },
      {
        location: {
          contains: search,
        },
      },
      {
        description: {
          contains: search,
        },
      },
    ]
  }

  return await payload.find({
    collection: 'event',
    where,
    limit,
    page,
    sort,
  })
}

export const getEventById = async (id: string) => {
  try {
    const payload = await getPayload({
      config,
    })

    const event = await payload.findByID({
      collection: 'event',
      id,
    })

    return {
      success: true,
      event,
      error: null,
    }
  } catch (error) {
    console.error('Error fetching event:', error)
    return {
      success: false,
      event: null,
      error: error instanceof Error ? error.message : 'Failed to fetch event',
    }
  }
}

export const createEvent = async (data: {
  name: string
  description?: string
  date: string
  location?: string
}) => {
  try {
    const payload = await getPayload({
      config,
    })

    const event = await payload.create({
      collection: 'event',
      data: {
        name: data.name,
        description: data.description,
        date: data.date,
        location: data.location,
      },
    })

    return {
      success: true,
      event,
      error: null,
    }
  } catch (error) {
    console.error('Error creating event:', error)
    return {
      success: false,
      event: null,
      error: error instanceof Error ? error.message : 'Failed to create event',
    }
  }
}

export const updateEvent = async (
  id: string,
  data: {
    name: string
    description?: string
    date: string
    location?: string
  },
) => {
  try {
    const payload = await getPayload({
      config,
    })

    const event = await payload.update({
      collection: 'event',
      id,
      data: {
        name: data.name,
        description: data.description,
        date: data.date,
        location: data.location,
      },
    })

    return {
      success: true,
      event,
      error: null,
    }
  } catch (error) {
    console.error('Error updating event:', error)
    return {
      success: false,
      event: null,
      error: error instanceof Error ? error.message : 'Failed to update event',
    }
  }
}

export const deleteEvent = async (id: string) => {
  try {
    const payload = await getPayload({
      config,
    })

    await payload.delete({
      collection: 'event',
      id,
    })

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error('Error deleting event:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete event',
    }
  }
}

export const addParticipantToEvent = async (eventId: string, data: {
  fullName: string
  email: string
  phoneNumber?: string
  age?: number
  job?: string
  address?: string,
  room?: string,
  floor?: string,
  participantGroup?: string,
}) => {
  try {
    const payload = await getPayload({
      config,
    })

    // Check if participant with this email already exists for this event
    const existingParticipants = await payload.find({
      collection: 'participant',
      where: {
        and: [
          {
            email: {
              equals: data.email,
            },
          },
          {
            event: {
              equals: eventId,
            },
          },
        ],
      },
      limit: 1,
    })

    if (existingParticipants.docs.length > 0) {
      return {
        success: false,
        error: 'Peserta dengan email ini sudah terdaftar untuk acara ini',
      }
    }

    const participant = await payload.create({
      collection: 'participant',
      data: {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber || '',
        age: data.age,
        job: data.job || '',
        address: data.address || '',
        event: eventId,
        attendanceStatus: 'present',
        willBePresent: true,
        registrationDate: new Date().toISOString(),
        room: data.room,
        floor: data.floor,
        participantGroup: data.participantGroup,
      },
    })

    return {
      success: true,
      participant,
      error: null,
    }
  } catch (error) {
    console.error('Error adding participant:', error)
    return {
      success: false,
      participant: null,
      error: error instanceof Error ? error.message : 'Failed to add participant',
    }
  }
}
