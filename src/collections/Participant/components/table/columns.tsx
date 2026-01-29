'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PhoneCallIcon, Share, Share2 } from 'lucide-react'
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
      return <Badge className="bg-green-500 hover:bg-green-600">Hadir</Badge>
    case 'absent':
      return <Badge variant="destructive">Tidak Hadir</Badge>
    case 'excused':
      return <Badge variant="secondary">Izin</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export const participantColumns: ColumnDef<Participant>[] = [
  {
    accessorKey: 'fullName',
    header: 'Nama Lengkap',
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
    header: 'Telepon',
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
    header: 'Bagikan',
    cell: ({ row }) => {
      const participant = row.original
      const targetUrl = `${window.location.origin}/participant/${participant.id}/qr`

      const handleWhatsAppShare = () => {
        if (!participant.phoneNumber) {
          toast.error('Nomor telepon tidak tersedia')
          return
        }

        // Format phone number (remove spaces, dashes, etc.)
        let phoneNumber = participant.phoneNumber.replace(/\D/g, '')

        // Replace first 0 with +62 (Indonesia country code)
        if (phoneNumber.startsWith('0')) {
          phoneNumber = '62' + phoneNumber.substring(1)
        }

        // WhatsApp message with participant name and polite greeting
        const message = encodeURIComponent(
          `Halo ${participant.fullName},\n\nKami mengundang Anda untuk konfirmasi kehadiran. Silakan klik link berikut untuk konfirmasi kehadiran Anda:\n\n${targetUrl}\n\nTerima kasih.`
        )

        // WhatsApp URL
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

        // Open WhatsApp in new window
        window.open(whatsappUrl, '_blank')
      }

      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              if (navigator.share) {
                await navigator.share({
                  title: 'Link Peserta',
                  text: 'Link konfirmasi peserta',
                  url: targetUrl,
                })
              } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(targetUrl)
                toast.success('Link berhasil disalin')
              }
            }}
          >
            <Share2 className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
            onClick={handleWhatsAppShare}
            disabled={!participant.phoneNumber}
          >
            <PhoneCallIcon className="size-4" />
          </Button>
        </div>
      )
    },
  },
]
