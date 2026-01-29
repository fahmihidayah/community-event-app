import { z } from 'zod'

export const settingsFormSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

export type SettingsFormSchema = z.infer<typeof settingsFormSchema>
