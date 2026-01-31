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
    const absenceReasonIndex = headers.findIndex((h) => h.includes('Hadir di Mabit Qowwamah 2026'))

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

        // Get absence reason value
        const absenceReason = columns[absenceReasonIndex]?.trim() || ''

        const participantData = {
          email,
          fullName,
          phoneNumber: columns[phoneIndex]?.trim() || '',
          age: parseInt(columns[ageIndex]?.trim()) || undefined,
          job: columns[jobIndex]?.trim() || '',
          address: columns[addressIndex]?.trim() || '',
          event: eventId,
          attendanceStatus: 'absent' as const,
          // If absence reason is empty, they will be present
          willBePresent: absenceReason.includes('Insya Allah'),
        }

        console.log(
          'data participants : ',
          JSON.stringify(participantData),
          columns[absenceReasonIndex]?.trim(),
        )

        if (existingParticipants.docs.length > 0) {
          // Update existing participant
          const existingParticipant = existingParticipants.docs[0]
          await payload.update({
            collection: 'participant',
            id: existingParticipant.id,
            data: {
              ...participantData,
            },
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

export const uploadRoomCsv = async (formData: FormData, eventId: string) => {
  try {
    const file = formData.get('file') as File
    if (!file) {
      return {
        success: false,
        message: 'No file provided',
        updated: 0,
        skipped: 0,
        failed: 0,
      }
    }

    // Read CSV file
    const text = await file.text()
    const lines = text.split('\n')

    // Find the header row (skip empty rows and non-header rows)
    let headerRowIndex = -1
    let headers: string[] = []
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.includes('Lantai') && line.includes('Nama')) {
        headers = line.split(',')
        headerRowIndex = i
        break
      }
    }

    if (headerRowIndex === -1) {
      return {
        success: false,
        message:
          'Header tidak ditemukan. Pastikan CSV memiliki kolom: Lantai, Nomor Kamar, Kelompok, Nama',
        updated: 0,
        skipped: 0,
        failed: 0,
      }
    }

    // Find column indexes
    const floorIndex = headers.findIndex((h) => h.includes('Lantai'))
    const roomIndex = headers.findIndex((h) => h.includes('Nomor Kamar'))
    const groupIndex = headers.findIndex((h) => h.includes('Kelompok'))
    const nameIndex = headers.findIndex((h) => h.includes('Nama'))

    const payload = await getPayload({ config })
    let updated = 0
    let skipped = 0
    let failed = 0

    // Process each row (skip header and rows before it)
    for (let i = headerRowIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const columns = line.split(',')

      const floor = columns[floorIndex]?.trim()
      const room = columns[roomIndex]?.trim()
      const participantGroup = columns[groupIndex]?.trim()
      const name = columns[nameIndex]?.trim()

      if (!name) {
        skipped++
        continue
      }

      try {
        // Find participant by name and event
        const existingParticipants = await payload.find({
          collection: 'participant',
          where: {
            and: [
              {
                fullName: {
                  equals: name,
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
          // Update existing participant with room data
          const existingParticipant = existingParticipants.docs[0]
          await payload.update({
            collection: 'participant',
            id: existingParticipant.id,
            data: {
              willBePresent: true,
              floor: floor || '',
              room: room || '',
              participantGroup: participantGroup || '',
            },
          })
          updated++
        } else {
          // Participant not found, skip
          skipped++
        }
      } catch (error) {
        console.error('Error updating participant:', error)
        failed++
      }
    }

    return {
      success: true,
      message: `Import ruangan selesai: ${updated} diperbarui, ${skipped} dilewati, ${failed} gagal`,
      updated,
      skipped,
      failed,
    }
  } catch (error) {
    console.error('Error uploading room CSV:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload room CSV',
      updated: 0,
      skipped: 0,
      failed: 0,
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
export const getAvailableRoom = async (eventId: string): Promise<string> => {
  const payload = await getPayload({ config })

  const participants = await payload.find({
    collection: 'participant',

    limit: 10000, // pastikan semua keambil
  })

  const MAX_ROOM_PER_FLOOR = 16
  const MAX_PERSON_PER_ROOM = 5

  // 🔹 Map untuk hitung isi kamar
  const roomCount: Record<string, number> = {}

  for (const p of participants.docs) {
    if (!p.room) continue
    roomCount[p.room] = (roomCount[p.room] || 0) + 1
  }

  console.log('data room : ', JSON.stringify(roomCount))

  let floor = 3

  // 🔹 Loop lantai terus sampai ketemu slot
  while (true) {
    for (let room = 1; room <= MAX_ROOM_PER_FLOOR; room++) {
      const roomKey = `${floor}.${room}`
      const count = roomCount[roomKey] || 0

      if (count < MAX_PERSON_PER_ROOM) {
        return roomKey // 🎯 kamar tersedia
      }
    }

    floor++

    // optional safety biar gak infinite
    if (floor > 100) {
      throw new Error('Semua kamar penuh')
    }
  }
}
