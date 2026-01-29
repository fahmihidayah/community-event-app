'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { EventTable } from '@/collections/Event/components/table'
import { type Event } from '@/collections/Event/components/table/columns'

interface EventTableWrapperProps {
  initialData: Event[]
  totalPages: number
  currentPage: number
  searchValue: string
}

export function EventTableWrapper({
  initialData,
  totalPages,
  currentPage,
  searchValue,
}: EventTableWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/dashboard/events?${params.toString()}`)
  }

  const handleSearchChange = (search: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    router.push(`/dashboard/events?${params.toString()}`)
  }

  return (
    <EventTable
      initialData={initialData}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onSearchChange={handleSearchChange}
      searchValue={searchValue}
    />
  )
}
