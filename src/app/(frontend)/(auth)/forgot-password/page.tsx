import ForgotPasswordForm from '@/collections/Users/components/forgot-password/forgot-password-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lupa Password',
  description: 'Reset password akun Posku Kuttab Al Fatih Anda.',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
