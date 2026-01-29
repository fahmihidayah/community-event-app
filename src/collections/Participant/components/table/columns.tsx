'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Share, Share2 } from 'lucide-react'
import { toast } from 'sonner'

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
      const participant = row.original
      return (
        <Link
          href={`/dashboard/participants/${participant.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {row.getValue('fullName')}
        </Link>
      )
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
    accessorKey: 'attendanceStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('attendanceStatus') as 'present' | 'absent' | 'excused'
      return getStatusBadge(status)
    },
  },
  {
    header: 'QR Link',
    cell: ({ row }) => {
      const participant = row.original
      return (
        <Button
          onClick={async () => {
            const targetUrl = `${window.location.origin}/participant/${participant.id}/qr`
            if (navigator.share) {
              await navigator.share({
                title: 'Participant Link',
                text: 'Participant confirmation link',
                url: targetUrl,
              })
            } else {
              // Fallback: copy to clipboard
              await navigator.clipboard.writeText(targetUrl)
              toast.success('Link copied to clipboard')
            }
          }}
        >
          <Share2 /> Share
        </Button>
      )
    },
  },
]
