'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Mail, Calendar } from 'lucide-react'

export type User = {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Mail className="size-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue('email')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="size-4" />
          <span>{format(new Date(date), 'PPP')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Updated',
    cell: ({ row }) => {
      const date = row.getValue('updatedAt') as string
      return (
        <div className="text-sm text-muted-foreground">
          {format(new Date(date), 'PPP p')}
        </div>
      )
    },
  },
  {
    id: 'status',
    header: 'Status',
    cell: () => {
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
    },
  },
]
