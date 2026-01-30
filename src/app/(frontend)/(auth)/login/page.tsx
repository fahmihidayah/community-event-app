import LoginForm from '@/collections/Users/components/login/login-form'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke akun Posku Kuttab Al Fatih untuk mengelola acara dan kehadiran.',
}

type Props = {
  searchParams : Promise<{ redirect?: string, showWarning?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { showWarning } = await searchParams
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      
      <div className="w-full max-w-md space-y-4">
        {showWarning && (
        <div className="w-full max-w-md space-y-4 bg-red-400 border-red-700 text-white rounded-lg p-4">
          <p className='text-sm text-center font-semibold'>Untuk Absensi QR Code, Silahkan login terlebih dahulu</p>
        </div>
      )}
        <LoginForm />
        
      </div>
    </div>
  )
}
