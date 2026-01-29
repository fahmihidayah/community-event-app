import { z } from 'zod'

export const eventFormSchema = z.object({
  name: z.string().min(1, 'Event name is required').min(3, 'Event name must be at least 3 characters'),
  description: z.string().optional(),
  date: z.string().min(1, 'Event date is required'),
  location: z.string().optional(),
})

export type EventFormSchema = z.infer<typeof eventFormSchema>
