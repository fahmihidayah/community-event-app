import { z } from 'zod'

export const participantFormSchema = z.object({
  fullName: z.string().min(1, 'Nama lengkap wajib diisi'),
  email: z.string().email('Email tidak valid').min(1, 'Email wajib diisi'),
  phoneNumber: z.string().optional(),
  age: z.string().optional(),
  job: z.string().optional(),
  address: z.string().optional(),
  room: z.string().optional(),
  floor: z.string().optional(),
  participantGroup: z.string().optional(),
})

export type ParticipantFormSchema = z.infer<typeof participantFormSchema>
