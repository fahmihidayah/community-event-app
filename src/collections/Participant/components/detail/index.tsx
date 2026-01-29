'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Participant } from '@/payload-types'
import { format } from 'date-fns'
import { User, Mail, Phone, MapPin, Briefcase, Calendar, CalendarCheck } from 'lucide-react'
import Link from 'next/link'

interface ParticipantDetailProps {
  participant: Participant
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'present':
      return <Badge className="bg-green-500 hover:bg-green-600">Present</Badge>
    case 'absent':
      return <Badge variant="destructive">Absent</Badge>
    case 'excused':
      return <Badge variant="secondary">Excused</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function ParticipantDetail({ participant }: ParticipantDetailProps) {
  const eventName = typeof participant.event === 'object' ? participant.event.name : 'Unknown Event'
  const eventId = typeof participant.event === 'object' ? participant.event.id : participant.event

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Participant Details</h1>
        <p className="text-muted-foreground mt-2">View participant information</p>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{participant.fullName}</CardTitle>
              <CardDescription className="text-base mt-1">
                Event: {eventName}
              </CardDescription>
            </div>
            {getStatusBadge(participant.attendanceStatus)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Contact Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{participant.email}</p>
                </div>
              </div>

              {participant.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{participant.phoneNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Personal Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {participant.age && (
                <div className="flex items-center gap-3">
                  <User className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">{participant.age} years old</p>
                  </div>
                </div>
              )}

              {participant.job && (
                <div className="flex items-center gap-3">
                  <Briefcase className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Job</p>
                    <p className="font-medium">{participant.job}</p>
                  </div>
                </div>
              )}

              {participant.address && (
                <div className="flex items-center gap-3 md:col-span-2">
                  <MapPin className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{participant.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Attendance Information */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Attendance Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Registration Date</p>
                  <p className="font-medium">
                    {participant.registrationDate
                      ? format(new Date(participant.registrationDate), 'PPP')
                      : '-'}
                  </p>
                </div>
              </div>

              {participant.attendanceDate && (
                <div className="flex items-center gap-3">
                  <CalendarCheck className="size-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Attendance Date</p>
                    <p className="font-medium">
                      {format(new Date(participant.attendanceDate), 'PPP p')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Link href={`/dashboard/events/${eventId}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Event
              </Button>
            </Link>
            {participant.attendanceStatus !== 'present' && (
              <Link
                href={`/dashboard/participants/${participant.id}?status=confirm`}
                className="flex-1"
              >
                <Button className="w-full">Confirm Attendance</Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
