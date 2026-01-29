'use client'

import { User } from '@/payload-types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCircle } from 'lucide-react'

interface WelcomeCardProps {
  user: User
}

export function WelcomeCard({ user }: WelcomeCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <UserCircle className="size-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Selamat datang kembali!</CardTitle>
            <CardDescription className="text-base">{user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Berikut adalah ringkasan statistik dashboard Anda
        </p>
      </CardContent>
    </Card>
  )
}
