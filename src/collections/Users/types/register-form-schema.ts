import { z } from 'zod'

export const registerFormSchema = z
  .object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(8, 'Password harus minimal 8 karakter'),
    confirmPassword: z.string().min(8, 'Password harus minimal 8 karakter'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  })

export type RegisterFormSchema = z.infer<typeof registerFormSchema>
