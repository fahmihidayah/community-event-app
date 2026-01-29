import { notFound } from 'next/navigation'
import {
  updateParticipantAttendanceStatusToPresent,
  getParticipantById,
} from '@/collections/Participant/actions'
import { ConfirmationResult } from '@/collections/Participant/components/confirm'
import ParticipantDetail from '@/collections/Participant/components/detail'

type Props = {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    status?: string
  }>
}

export default async function ParticipantPage({ params, searchParams }: Props) {
  const { id } = await params
  const { status } = await searchParams

  // If status is confirm, update attendance and show confirmation
  if (status === 'confirm') {
    const result = await updateParticipantAttendanceStatusToPresent(id)
    if (result.success && result.participant) {
      return (
        <ConfirmationResult success={true} participantName={(result.participant as any).fullName} />
      )
    }
    return <ConfirmationResult success={false} error={result.error || 'Participant not found'} />
  }

  // Otherwise, show participant details
  const participantResult = await getParticipantById(id)

  if (!participantResult.success || !participantResult.participant) {
    notFound()
  }

  return <ParticipantDetail participant={participantResult.participant as any} />
}
