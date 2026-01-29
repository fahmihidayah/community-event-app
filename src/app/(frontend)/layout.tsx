import React from 'react'
import './styles.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Navbar } from '@/components/layouts/navbar'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/providers/AuthProvider'

export const metadata = {
  title: {
    default: 'Posku - Sistem Manajemen Acara Kuttab Al Fatih',
    template: '%s | Posku Kuttab Al Fatih',
  },
  description:
    'Platform digital untuk mengelola acara, peserta, dan kehadiran di Kuttab Al Fatih. Memudahkan administrasi dan meningkatkan efisiensi pengelolaan kegiatan sekolah.',
  keywords: [
    'Kuttab Al Fatih',
    'manajemen acara',
    'presensi digital',
    'QR code',
    'sistem informasi sekolah',
    'posku',
  ],
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
        <ThemeProvider>
          <QueryProvider>
            <main>{children}</main>
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
