import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/collections/Dashboard/actions'
import SettingsForm from '@/collections/Dashboard/components/settings/settings-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function SettingsPage() {
  const userResult = await getCurrentUser()

  if (!userResult.success || !userResult.user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Back Button and Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
          <p className="text-muted-foreground mt-2">Kelola informasi akun Anda</p>
        </div>
      </div>

      {/* Settings Form */}
      <SettingsForm currentEmail={userResult.user.email} />
    </div>
  )
}
