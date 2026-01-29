import { Suspense } from 'react'
import { getListEvents } from '@/collections/Event/actions'
import { PageHeader } from '@/components/layouts/table-list'
import { EventTableWrapper } from '@/collections/Event/components/table/event-table-wrapper'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daftar Acara',
  description: 'Kelola semua acara dan kegiatan Kuttab Al Fatih.',
}

export default async function TableEventPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''

  const result = await getListEvents({
    page,
    limit: 10,
    search,
    sort: '-createdAt',
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Manage your events and activities"
        addButtonText="Add Event"
        addButtonLink="/dashboard/events/create"
      />

      <Suspense fallback={<div>Loading...</div>}>
        <EventTableWrapper
          initialData={result.docs as any}
          totalPages={result.totalPages}
          currentPage={page}
          searchValue={search}
        />
      </Suspense>
    </div>
  )
}
