import { notFound } from 'next/navigation'
import { getEventById } from '@/collections/Event/actions'
import EditEventForm from '@/collections/Event/components/form/edit-event-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch event details
  const eventResult = await getEventById(id)

  if (!eventResult.success || !eventResult.event) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Back Button and Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/events/${id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Acara</h1>
          <p className="text-muted-foreground mt-2">Perbarui informasi acara</p>
        </div>
      </div>

      {/* Edit Form */}
      <EditEventForm event={eventResult.event as any} />
    </div>
  )
}
