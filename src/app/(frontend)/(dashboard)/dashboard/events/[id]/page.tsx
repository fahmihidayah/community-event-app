import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getEventById } from '@/collections/Event/actions'
import { getListParticipantsByEvent } from '@/collections/Participant/actions'
import { EventSummary } from '@/collections/Event/components/detail'
import { ParticipantTableWrapper } from '@/collections/Participant/components/table/participant-table-wrapper'
import { ImportCsv } from '@/collections/Participant/components/import'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function DetailEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const { id } = await params
  const queryParams = await searchParams
  const page = Number(queryParams.page) || 1
  const search = queryParams.search || ''

  // Fetch event details
  const eventResult = await getEventById(id)

  if (!eventResult.success || !eventResult.event) {
    notFound()
  }

  // Fetch participants
  const participantsResult = await getListParticipantsByEvent(id, {
    page,
    limit: 10,
    search,
    sort: '-createdAt',
  })

  if (!participantsResult.success || !participantsResult.data || !participantsResult.stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/events">
            <Button variant="outline" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Event Details</h1>
            <p className="text-muted-foreground mt-2">Error loading participants data</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button and Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/events">
          <Button variant="outline" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Details</h1>
          <p className="text-muted-foreground mt-2">View event information and participants</p>
        </div>
      </div>

      {/* Event Summary */}
      <EventSummary event={eventResult.event as any} stats={participantsResult.stats} />

      {/* Import CSV */}
      <ImportCsv eventId={id} />

      {/* Participants Table */}
      <Suspense fallback={<div>Loading participants...</div>}>
        <ParticipantTableWrapper
          initialData={participantsResult.data.docs as any}
          totalPages={participantsResult.data.totalPages}
          currentPage={page}
          searchValue={search}
          eventId={id}
        />
      </Suspense>
    </div>
  )
}
