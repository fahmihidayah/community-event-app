import { PayloadRequest } from 'payload'

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
        event: {
          equals: eventId,
        },
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