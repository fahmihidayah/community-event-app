'use client'
import { DashboardLayout } from '@/components/layouts/dashboard'
import { SignOutDialog } from '@/components/layouts/dashboard/sign-out-dialog'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useSession } from '@/providers/AuthProvider'
import { Calendar, LayoutDashboard, Settings, Users } from 'lucide-react'
import { logout } from '@/collections/Users/actions'
import { toast } from 'sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading, error } = useSession()
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)

  const handleSignOut = () => {
    setShowSignOutDialog(true)
  }

  const confirmSignOut = async () => {
    try {
      const result = await logout()

      if (result.success) {
        toast.success('Signed out successfully')
        router.push('/login')
      } else {
        toast.error('Failed to sign out')
      }
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('An error occurred while signing out')
    } finally {
      setShowSignOutDialog(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  // Show error state or redirect to login if no user
  if (error || !user) {
    console.log('[DASHBOARD] No user or error, redirecting to login')
    return null
  }

  return (
    <>
      <DashboardLayout
        user={{
          name: user?.email || 'Guest',
          email: user.email || '',
        }}
        onSignOut={handleSignOut}
        config={{
          header: {
            appName: 'Posku',
            appInitial: 'P',
            subtitle: 'Posku Management Dashboard',
          },
          headerTitle: 'Utama',
          navigationGroups: [
            {
              label: 'Dashboard',
              items: [
                {
                  title: 'Dashboard',
                  icon: LayoutDashboard,
                  url: '/dashboard',
                },
                {
                  title: 'Users',
                  icon: Users,
                  url: '/dashboard/users',
                },
              ],
            },
            {
              label: 'Event',
              items: [
                {
                  title: 'Event',
                  icon: Calendar,
                  url: '/dashboard/events',
                },
                {
                  title: 'Pengaturan',
                  icon: Settings,
                  url: '/dashboard/settings',
                },
              ],
            },
          ],
        }}
      >
        {children}
      </DashboardLayout>

      <SignOutDialog
        open={showSignOutDialog}
        onOpenChange={setShowSignOutDialog}
        onConfirm={confirmSignOut}
      />
    </>
  )
}
