import { Suspense } from 'react'
import { getListUsers } from '@/collections/Users/actions'
import { PageHeader } from '@/components/layouts/table-list'
import { UserTableWrapper } from '@/collections/Users/components/table/user-table-wrapper'

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''

  const result = await getListUsers({
    page,
    limit: 10,
    search,
    sort: '-createdAt',
  })

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Users" description="Manage system users" />
        <p className="text-muted-foreground">Error loading users data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage system users and access" />

      <Suspense fallback={<div>Loading...</div>}>
        <UserTableWrapper
          initialData={result.data.docs as any}
          totalPages={result.data.totalPages}
          currentPage={page}
          searchValue={search}
        />
      </Suspense>
    </div>
  )
}
