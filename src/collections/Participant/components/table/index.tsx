'use client'

import { DataTable } from '@/components/layouts/table-list'
import { TablePagination } from '@/components/layouts/table-list'
import { participantColumns, type Participant } from './columns'

interface ParticipantTableProps {
  initialData: Participant[]
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  onSearchChange: (search: string) => void
  searchValue: string
}

export function ParticipantTable({
  initialData,
  totalPages,
  currentPage,
  onPageChange,
  onSearchChange,
  searchValue,
}: ParticipantTableProps) {
  return (
    <div className="space-y-4">
      <DataTable
        title="Peserta"
        description="Daftar peserta acara"
        data={initialData}
        columns={participantColumns}
        searchable={true}
        searchPlaceholder="Cari peserta berdasarkan nama, email, atau telepon..."
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        emptyMessage="Tidak ada peserta ditemukan."
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
