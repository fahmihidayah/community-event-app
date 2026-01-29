import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, QrCode, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beranda',
  description:
    'Platform digital untuk mengelola acara, peserta, dan kehadiran di Kuttab Al Fatih. Sistem manajemen acara dengan fitur QR code, laporan real-time, dan import data CSV.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <BookOpen className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Sistem Manajemen Acara
              <span className="block text-primary mt-2">Kuttab Al Fatih</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
              Platform digital untuk mengelola acara, peserta, dan kehadiran di Kuttab Al Fatih.
              Memudahkan administrasi dan meningkatkan efisiensi pengelolaan kegiatan sekolah.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/register">Mulai Sekarang</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <Link href="/login">Masuk</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Kelola semua kegiatan sekolah dengan mudah dan efisien
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 mb-4">
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">Kelola Acara</CardTitle>
                  <CardDescription>Atur jadwal kegiatan</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Buat, edit, dan kelola semua acara sekolah dengan mudah. Pantau status dan detail setiap kegiatan.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 mb-4">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">Data Peserta</CardTitle>
                  <CardDescription>Kelola informasi peserta</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Simpan dan kelola data lengkap peserta setiap acara. Import data dengan mudah melalui CSV.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 mb-4">
                    <QrCode className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">QR Code</CardTitle>
                  <CardDescription>Presensi digital</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sistem presensi modern dengan QR Code. Peserta dapat konfirmasi kehadiran dengan mudah.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 mb-4">
                    <BookOpen className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-lg">Laporan</CardTitle>
                  <CardDescription>Statistik lengkap</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Lihat statistik kehadiran dan laporan acara secara real-time. Data akurat untuk evaluasi.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Tentang Posku Kuttab Al Fatih
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Posku adalah platform manajemen acara yang dirancang khusus untuk memenuhi kebutuhan
              Kuttab Al Fatih dalam mengelola berbagai kegiatan sekolah. Dengan fitur-fitur modern
              dan antarmuka yang mudah digunakan, kami berkomitmen untuk membantu meningkatkan
              efisiensi administrasi dan kualitas pelayanan kepada seluruh civitas Kuttab Al Fatih.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/register">Bergabung Sekarang</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
