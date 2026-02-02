import AddParticipantForm from '@/collections/Event/components/participant/add-participant-form'
import { getEventById } from '@/collections/Event/actions'
import { notFound } from 'next/navigation'
import { getAvailableRoom } from '@/collections/Participant/actions'

export default async function AddParticipants({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch event details to ensure it exists
  const eventResult = await getEventById(id)

  if (!eventResult.success || !eventResult.event) {
    notFound()
  }

  const availableRoom = await getAvailableRoom(id)

  return <AddParticipantForm eventId={id} availableRoom={availableRoom} />
}
