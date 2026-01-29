'use client'

import { useState } from 'react'
import { DataTable } from '@/components/layouts/table-list'
import { TablePagination } from '@/components/layouts/table-list'
import { eventColumns, type Event } from './columns'

interface EventTableProps {
  initialData: Event[]
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  onSearchChange: (search: string) => void
  searchValue: string
}

export function EventTable({
  initialData,
  totalPages,
  currentPage,
  onPageChange,
  onSearchChange,
  searchValue,
}: EventTableProps) {
  return (
    <div className="space-y-4">
      <DataTable
        title="Events"
        description="Manage your events"
        data={initialData}
        columns={eventColumns}
        searchable={true}
        searchPlaceholder="Search events by name, location, or description..."
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        emptyMessage="No events found."
        manualPagination={true}
        totalPages={totalPages}
      />
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}
