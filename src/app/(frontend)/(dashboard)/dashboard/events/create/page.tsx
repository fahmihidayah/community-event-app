import { EventForm } from '@/collections/Event/components/form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buat Acara Baru',
  description: 'Tambahkan acara baru ke kalender Kuttab Al Fatih.',
}

export default function CreateEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
        <p className="text-muted-foreground mt-2">Add a new event to your calendar</p>
      </div>
      <EventForm />
    </div>
  )
}
