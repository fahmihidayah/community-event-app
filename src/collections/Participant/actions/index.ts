'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export const uploadCsv = async (formData: FormData, eventId: string) => {
  try {
    const file = formData.get('file') as File
    if (!file) {
      return {
        success: false,
        message: 'No file provided',
        imported: 0,
        failed: 0,
      }
    }

    // Read CSV file
    const text = await file.text()
    const lines = text.split('\n')
    const headers = lines[0].split(',')

    // Find column indexes
    const emailIndex = headers.findIndex((h) => h.includes('Email address'))
    const nameIndex = headers.findIndex((h) => h.includes('Nama Lengkap'))
    const phoneIndex = headers.findIndex((h) => h.includes('Nomor Whatsapp'))
    const ageIndex = headers.findIndex((h) => h.includes('Usia'))
    const jobIndex = headers.findIndex((h) => h.includes('Pekerjaan atau Usaha'))
    const addressIndex = headers.findIndex((h) => h.includes('Alamat Rumah'))

    const payload = await getPayload({ config })
    let imported = 0
    let updated = 0
    let failed = 0

    // Process each row (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const columns = line.split(',')

      const email = columns[emailIndex]?.trim()
      const fullName = columns[nameIndex]?.trim()

      if (!email || !fullName) {
        failed++
        continue
      }

      try {
        // Check if participant with this email already exists for this event
        const existingParticipants = await payload.find({
          collection: 'participant',
          where: {
            and: [
              {
                email: {
                  equals: email,
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

        const participantData = {
          email,
          fullName,
          phoneNumber: columns[phoneIndex]?.trim() || '',
          age: parseInt(columns[ageIndex]?.trim()) || undefined,
          job: columns[jobIndex]?.trim() || '',
          address: columns[addressIndex]?.trim() || '',
          event: eventId,
          attendanceStatus: 'absent' as const,
        }

        if (existingParticipants.docs.length > 0) {
          // Update existing participant
          const existingParticipant = existingParticipants.docs[0]
          await payload.update({
            collection: 'participant',
            id: existingParticipant.id,
            data: participantData,
          })
          updated++
        } else {
          // Create new participant
          await payload.create({
            collection: 'participant',
            data: {
              ...participantData,
              registrationDate: new Date().toISOString(),
            },
          })
          imported++
        }
      } catch (error) {
        console.error('Error importing participant:', error)
        failed++
      }
    }

    return {
      success: true,
      message: `Import selesai: ${imported} baru, ${updated} diperbarui, ${failed} gagal`,
      imported,
      updated,
      failed,
    }
  } catch (error) {
    console.error('Error uploading CSV:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload CSV',
      imported: 0,
      failed: 0,
    }
  }
}

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
