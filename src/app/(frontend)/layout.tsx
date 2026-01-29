import React from 'react'
import './styles.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Navbar } from '@/components/layouts/navbar'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/providers/AuthProvider'

export const metadata = {
  description: 'A modern web application built with Payload CMS and Next.js.',
  title: 'Payload Starter',
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
