'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export type Participant = {
  id: string
  fullName: string
  email: string
  phoneNumber?: string
  address?: string
  age?: number
  job?: string
  attendanceStatus: 'present' | 'absent' | 'excused'
  attendanceDate?: string
  registrationDate: string
  createdAt: string
  updatedAt: string
}

const getStatusBadge = (status: 'present' | 'absent' | 'excused') => {
  switch (status) {
    case 'present':
      return <Badge className="bg-green-500 hover:bg-green-600">Present</Badge>
    case 'absent':
      return <Badge variant="destructive">Absent</Badge>
    case 'excused':
      return <Badge variant="secondary">Excused</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export const participantColumns: ColumnDef<Participant>[] = [
  {
    accessorKey: 'fullName',
    header: 'Full Name',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('fullName')}</div>
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return <div className="text-muted-foreground">{row.getValue('email')}</div>
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone',
    cell: ({ row }) => {
      return <div>{row.getValue('phoneNumber') || '-'}</div>
    },
  },
  {
    accessorKey: 'job',
    header: 'Job',
    cell: ({ row }) => {
      return <div>{row.getValue('job') || '-'}</div>
    },
  },
  {
    accessorKey: 'age',
    header: 'Age',
    cell: ({ row }) => {
      const age = row.getValue('age') as number
      return <div>{age || '-'}</div>
    },
  },
  {
    accessorKey: 'attendanceStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('attendanceStatus') as 'present' | 'absent' | 'excused'
      return getStatusBadge(status)
    },
  },
  {
    accessorKey: 'registrationDate',
    header: 'Registration Date',
    cell: ({ row }) => {
      const date = row.getValue('registrationDate') as string
      return <div className="text-sm">{format(new Date(date), 'PPP')}</div>
    },
  },
]
