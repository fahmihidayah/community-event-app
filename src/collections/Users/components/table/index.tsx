'use client'

import { DataTable } from '@/components/layouts/table-list'
import { TablePagination } from '@/components/layouts/table-list'
import { userColumns, type User } from './columns'

interface UserTableProps {
  initialData: User[]
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  onSearchChange: (search: string) => void
  searchValue: string
}

export function UserTable({
  initialData,
  totalPages,
  currentPage,
  onPageChange,
  onSearchChange,
  searchValue,
}: UserTableProps) {
  return (
    <div className="space-y-4">
      <DataTable
        title="Users"
        description="Manage system users"
        data={initialData}
        columns={userColumns}
        searchable={true}
        searchPlaceholder="Search users by email..."
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        emptyMessage="No users found."
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
