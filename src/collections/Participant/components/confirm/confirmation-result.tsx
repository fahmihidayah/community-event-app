'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, UserCheck, SquareActivity, Users, House } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Participant } from '@/payload-types'

interface ConfirmationResultProps {
  success: boolean
  participant?: Participant
  error?: string
}

export function ConfirmationResult({ success, participant, error }: ConfirmationResultProps) {
  const fallbackText = 'Belum ditentukan'
  if (success && participant?.fullName) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Kehadiran Dikonfirmasi!</CardTitle>
            <CardDescription className="text-base">Kehadiran berhasil dicatat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-3">
              {/* Nama Peserta */}
              <div className="flex items-center gap-3">
                <UserCheck className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Peserta</p>
                  <p className="text-lg font-semibold">{participant.fullName}</p>
                </div>
              </div>

              {/* Kelompok */}
              <div className="flex items-center gap-3">
                <Users className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Kelompok</p>
                  <p className="font-medium">{participant.participantGroup || fallbackText}</p>
                </div>
              </div>

              {/* Ruangan */}
              <div className="flex items-center gap-3">
                <House className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ruangan</p>
                  <p className="font-medium">{participant.room || fallbackText}</p>
                </div>
              </div>

              {/* Lantai */}
              <div className="flex items-center gap-3">
                <SquareActivity className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Lantai</p>
                  <p className="font-medium">{participant.floor || fallbackText}</p>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Status kehadiran peserta telah diperbarui menjadi <b>Hadir</b>.
            </p>

            <Link href="/dashboard/events" className="block">
              <Button className="w-full" variant="default">
                Kembali ke Acara
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="size-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Konfirmasi Gagal</CardTitle>
          <CardDescription className="text-base">
            Tidak dapat mengkonfirmasi kehadiran
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-600 text-center">{error || 'Peserta tidak ditemukan'}</p>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Peserta tidak dapat ditemukan atau link konfirmasi mungkin tidak valid.
          </p>

          <Link href="/dashboard/events" className="block">
            <Button className="w-full" variant="outline">
              Kembali ke Acara
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
