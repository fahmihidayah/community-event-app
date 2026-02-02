import { getEventById, getParticipantCount } from '@/collections/Event/actions'
import { EventSummary } from '@/collections/Event/components/detail'
import { getListParticipantsByEvent } from '@/collections/Participant/actions'
import { ImportCsv } from '@/collections/Participant/components/import'
import { ImportRoom } from '@/collections/Participant/components/import-room'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Download, FileText, Users, UserCheck, UserX } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ReportEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Fetch event details
  const eventResult = await getEventById(id)

  if (!eventResult.success || !eventResult.event) {
    notFound()
  }

  // Fetch participant statistics
  const participantsResult = await getListParticipantsByEvent(id, {
    limit: 1000, // Get all participants for accurate stats
  })

  // Get participant counts
  const participantCount = await getParticipantCount(id)

  if (!participantsResult.success || !participantsResult.data || !participantsResult.stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/events/${id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Laporan Acara</h1>
            <p className="text-muted-foreground mt-2">Gagal memuat data peserta</p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate additional statistics
  const willBePresentCount = (participantsResult.data.docs as any[]).filter(
    (p) => p.willBePresent === true,
  ).length
  const notPresentCount = participantsResult.stats.totalParticipants - willBePresentCount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/events/${id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Laporan Acara</h1>
            <p className="text-muted-foreground mt-2">
              Ringkasan dan statistik lengkap acara
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Unduh PDF
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 size-4" />
            Unduh CSV
          </Button>
        </div>
      </div>

      {/* Event Summary */}
      <EventSummary event={eventResult.event as any} stats={participantsResult.stats} />

      {/* Detailed Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Terdaftar</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {participantsResult.stats.totalParticipants}
            </div>
            <p className="text-xs text-muted-foreground">Seluruh peserta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Akan Hadir</CardTitle>
            <UserCheck className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{willBePresentCount}</div>
            <p className="text-xs text-muted-foreground">
              {participantsResult.stats.totalParticipants > 0
                ? Math.round((willBePresentCount / participantsResult.stats.totalParticipants) * 100)
                : 0}
              % dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sudah Hadir</CardTitle>
            <UserCheck className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {participantCount.success ? participantCount.present : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {participantsResult.stats.presentPercentage}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tidak Hadir</CardTitle>
            <UserX className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {participantCount.success ? participantCount.absent : 0}
            </div>
            <p className="text-xs text-muted-foreground">Belum check-in</p>
          </CardContent>
        </Card>
      </div>

      {/* Import CSV Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Manajemen Data</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <ImportCsv eventId={id} />
          <ImportRoom eventId={id} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Kehadiran</CardTitle>
            <CardDescription>Status kehadiran peserta terkini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sudah Check-in</span>
              <span className="text-sm font-bold text-green-600">
                {participantCount.success ? participantCount.present : 0} orang
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Belum Check-in</span>
              <span className="text-sm font-bold text-red-600">
                {participantCount.success ? participantCount.absent : 0} orang
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium">Total</span>
              <span className="text-sm font-bold">
                {participantsResult.stats.totalParticipants} orang
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Konfirmasi Kehadiran</CardTitle>
            <CardDescription>Status konfirmasi peserta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Akan Hadir</span>
              <span className="text-sm font-bold text-blue-600">{willBePresentCount} orang</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tidak Hadir</span>
              <span className="text-sm font-bold text-gray-600">{notPresentCount} orang</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium">Total</span>
              <span className="text-sm font-bold">
                {participantsResult.stats.totalParticipants} orang
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
