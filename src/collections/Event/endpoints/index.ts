import { PayloadRequest } from 'payload'

export const downloadPresentParticipantCsv = async (req: PayloadRequest): Promise<Response> => {
  try {
    // Get event ID from route params
    const eventId = req.routeParams?.id

    if (!eventId) {
      return Response.json(
        {
          error: 'Event ID is required',
        },
        { status: 400 },
      )
    }

    // Get all participants for this event
    const participants = await req.payload.find({
      collection: 'participant',
      where: {
        and: [
          {
            event: {
              equals: eventId,
            },
          },
          {
            attendanceDate: {
              not_equals: "",
            }
          }
        ],
      },
      limit: 1000, // Adjust as needed
    })

    // Get the base URL from the request
    const protocol = req.headers.get('x-forwarded-proto') || 'https'
    const host = req.headers.get('host') || req.headers.get('x-forwarded-host')
    const baseUrl = `${protocol}://${host}`

    // Format the response
    const docs = participants.docs;

    
    /**
     * 1️⃣ Define CSV headers
     * Adjust fields as needed
     */
    const headers = [
      'Full Name',
      'Phone Number',
      'Email',
      'Age',
      'Job',
      'Address',
      'Attendance Date',
      'Room',
      'Floor',
      'Group',
    ]

    /**
     * 2️⃣ Convert data to CSV rows
     */
    const rows = docs.map((p) => [
      `"${p.fullName ?? ''}"`,
      `"${p.phoneNumber ?? ''}"`,
      `"${p.email ?? ''}"`,
      `"${p.age ?? ''}"`,
      `"${p.job ?? ''}"`,
      `"${p.address ?? ''}"`,
      `"${p.attendanceDate ?? ''}`,
      `"${p.room ?? ''}"`,
      `"${p.floor ?? ''}"`,
      `"${p.participantGroup ?? ''}"`,
    ].join(','))

    /**
     * 3️⃣ Combine headers + rows
     */
    const csvContent = [
      headers.join(','),
      ...rows,
    ].join('\n')

    /**
     * 4️⃣ Return as downloadable CSV
     */
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="present-participants-${eventId}.csv"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Error fetching participants:', error)
    return Response.json(
      {
        error: 'Failed to fetch participants',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

export const getAllParticipants = async (req: PayloadRequest): Promise<Response> => {
  try {
    // Get event ID from route params
    const eventId = req.routeParams?.id

    if (!eventId) {
      return Response.json(
        {
          error: 'Event ID is required',
        },
        { status: 400 },
      )
    }

    // Get all participants for this event
    const participants = await req.payload.find({
      collection: 'participant',
      where: {
        and: [
          {
            event: {
              equals: eventId,
            },
          },
          {
            willBePresent: {
              equals: true,
            },
          },
        ],
      },
      limit: 1000, // Adjust as needed
    })

    // Get the base URL from the request
    const protocol = req.headers.get('x-forwarded-proto') || 'https'
    const host = req.headers.get('host') || req.headers.get('x-forwarded-host')
    const baseUrl = `${protocol}://${host}`

    // Format the response
    const formattedParticipants = participants.docs.map((participant: any) => ({
      fullName: participant.fullName,
      phoneNumber: participant.phoneNumber,
      room: participant.room,
      floor: participant.floor,
      group: participant.participantGroup,
      qrCode: `${baseUrl}/participant/${participant.id}/qr`,
    }))

    return Response.json(formattedParticipants, { status: 200 })
  } catch (error) {
    console.error('Error fetching participants:', error)
    return Response.json(
      {
        error: 'Failed to fetch participants',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
