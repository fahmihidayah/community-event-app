import { redirect } from 'next/navigation'
import { getMeUser } from '@/lib/data/user'
import { getDashboardStats } from '../../../../collections/Dashboard/actions'
import { WelcomeCard } from '../../../../collections/Dashboard/components/welcome-card'
import { DashboardStats } from '../../../../collections/Dashboard/components/dashboard-stats'
import { UpcomingEvents } from '../../../../collections/Dashboard/components/upcoming-events'

export default async function DashboardPage() {
  // Get current user
  const { user } = await getMeUser()

  if (!user) {
    redirect('/login')
  }

  // Get dashboard statistics
  const statsResult = await getDashboardStats()

  if (!statsResult.success || !statsResult.stats) {
    console.error('[DASHBOARD] Error loading dashboard data:', statsResult.error)
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Error loading dashboard data</p>
        <p className="text-sm text-red-500">{statsResult.error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to Rumah Anak Hebat Dashboard</p>
      </div>

      {/* Welcome Card */}
      <WelcomeCard user={user} />

      {/* Statistics Cards */}
      <DashboardStats
        stats={{
          totalUsers: statsResult.stats.totalUsers,
          totalEvents: statsResult.stats.totalEvents,
        }}
      />

      {/* Upcoming Events */}
      <UpcomingEvents events={statsResult.stats.upcomingEvents as any} />
    </div>
  )
}
