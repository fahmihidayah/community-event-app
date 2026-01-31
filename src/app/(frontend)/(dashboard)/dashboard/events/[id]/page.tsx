import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getEventById } from '@/collections/Event/actions'
import { getListParticipantsByEvent } from '@/collections/Participant/actions'
import { EventSummary } from '@/collections/Event/components/detail'
import { ParticipantTableWrapper } from '@/collections/Participant/components/table/participant-table-wrapper'
import { ImportCsv } from '@/collections/Participant/components/import'
import { ImportRoom } from '@/collections/Participant/components/import-room'
import { Button } from '@/components/ui/button'
import { ArrowLeft, UserPlus } from 'lucide-react'
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
            <h1 className="text-3xl font-bold tracking-tight">Detail Acara</h1>
            <p className="text-muted-foreground mt-2">Gagal memuat data peserta</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button and Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/events">
            <Button variant="outline" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detail Acara</h1>
            <p className="text-muted-foreground mt-2">Lihat informasi acara dan peserta</p>
          </div>
        </div>
        <Link href={`/dashboard/events/${id}/report`}>
          <Button>Lihat Report Event</Button>
        </Link>
        <Link href={`/dashboard/events/${id}/add`}>
          <Button>
            <UserPlus className="mr-2 size-4" />
            Tambah Peserta
          </Button>
        </Link>
      </div>

      {/* Event Summary */}
      {/* <EventSummary event={eventResult.event as any} stats={participantsResult.stats} /> */}

      {/* Import CSV - Grid 2 Columns */}
      {/* <div className="grid gap-6 md:grid-cols-2">
        <ImportCsv eventId={id} />
        <ImportRoom eventId={id} />
      </div> */}

      {/* Participants Table */}
      <Suspense fallback={<div>Memuat peserta...</div>}>
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
