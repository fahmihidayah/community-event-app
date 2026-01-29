'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ParticipantTable } from './index'
import { type Participant } from './columns'

interface ParticipantTableWrapperProps {
  initialData: Participant[]
  totalPages: number
  currentPage: number
  searchValue: string
  eventId: string
}

export function ParticipantTableWrapper({
  initialData,
  totalPages,
  currentPage,
  searchValue,
  eventId,
}: ParticipantTableWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/dashboard/events/${eventId}?${params.toString()}`)
  }

  const handleSearchChange = (search: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    router.push(`/dashboard/events/${eventId}?${params.toString()}`)
  }

  return (
    <ParticipantTable
      initialData={initialData}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onSearchChange={handleSearchChange}
      searchValue={searchValue}
    />
  )
}
