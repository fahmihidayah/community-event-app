'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { UserTable } from './index'
import { type User } from './columns'

interface UserTableWrapperProps {
  initialData: User[]
  totalPages: number
  currentPage: number
  searchValue: string
}

export function UserTableWrapper({
  initialData,
  totalPages,
  currentPage,
  searchValue,
}: UserTableWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/dashboard/users?${params.toString()}`)
  }

  const handleSearchChange = (search: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    router.push(`/dashboard/users?${params.toString()}`)
  }

  return (
    <UserTable
      initialData={initialData}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onSearchChange={handleSearchChange}
      searchValue={searchValue}
    />
  )
}
