'use client'

import { format } from 'date-fns'
import { Calendar, MapPin, Users, CheckCircle, Percent } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface EventSummaryProps {
  event: {
    id: string
    name: string
    description?: string
    date: string
    location?: string
  }
  stats: {
    totalParticipants: number
    presentParticipants: number
    presentPercentage: number
  }
}

export function EventSummary({ event, stats }: EventSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Event Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{event.name}</CardTitle>
          {event.description && <CardDescription>{event.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Event Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.date), 'PPP p')}
                </p>
              </div>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground">Registered participants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.presentParticipants}</div>
            <p className="text-xs text-muted-foreground">Participants attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Percent className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presentPercentage}%</div>
            <p className="text-xs text-muted-foreground">Of total participants</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
