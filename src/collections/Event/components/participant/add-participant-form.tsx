'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  User,
  Mail,
  Phone,
  Calendar as AgeIcon,
  Briefcase,
  MapPin,
  Loader2,
  UserPlus,
  ArrowLeft,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { participantFormSchema, ParticipantFormSchema } from '../../types/participant-form-schema'
import { addParticipantToEvent } from '../../actions'
import Link from 'next/link'

interface AddParticipantFormProps {
  eventId: string
  availableRoom: string
}

export default function AddParticipantForm({ eventId, availableRoom }: AddParticipantFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<ParticipantFormSchema>({
    resolver: zodResolver(participantFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      age: '',
      job: '',
      address: '',
      floor: availableRoom.split('.')[0],
      room: availableRoom.split('.')[1],
      participantGroup: '',
    },
  })

  const onSubmit: SubmitHandler<ParticipantFormSchema> = async (values) => {
    setIsLoading(true)
    try {
      const result = await addParticipantToEvent(eventId, {
        ...values,
        age: values.age ? Number(values.age) : undefined,
      })

      if (result.success) {
        toast.success('Peserta berhasil ditambahkan!')
        router.push(`/dashboard/participants/${result.participant?.id}`)
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal menambahkan peserta')
      }
    } catch (error) {
      console.error('Error adding participant:', error)
      toast.error('Terjadi kesalahan saat menambahkan peserta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full ">
      <h3 className="text-2xl font-bold mb-4">Tambah Peserta Baru</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nama Lengkap"
                      className="pl-10"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="nama@contoh.com"
                      className="pl-10"
                      type="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor WhatsApp</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="0812..."
                      className="pl-10"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Age */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usia</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <AgeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Usia"
                        className="pl-10"
                        type="number"
                        disabled={isLoading}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Job */}
            <FormField
              control={form.control}
              name="job"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pekerjaan</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Pekerjaan"
                        className="pl-10"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      placeholder="Alamat Lengkap"
                      className="pl-10 resize-none"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="participantGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grup Peserta</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Grup Peserta"
                      className="pl-10 resize-none"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lantai</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Lantai"
                      className="pl-10 resize-none"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ruangan</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Ruangan"
                      className="pl-10 resize-none"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Tambah Peserta
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href={`/dashboard/events/${eventId}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Kembali ke Detail Acara
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}
