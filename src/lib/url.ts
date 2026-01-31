import { Participant } from '@/payload-types'

export const generateWelcomeText = (participant: Participant) => {
  const text = `Terima kasih Ayah ${participant.fullName} telah melakukan registrasi dan berpartisipasi dalam acara kami.

Informasi kamar Ayah:
Lantai ${participant.floor}, Ruang ${participant.room}.

Semoga acara ini berjalan lancar dan memberikan manfaat.`

  return urlEncode(text)
}

export const urlEncode = (text: string) => {
  return encodeURIComponent(text)
}

export function sanitizePhoneNumber(phoneNumber?: string | null) {
  if (!phoneNumber) return ''
  if (phoneNumber.startsWith('62')) return '+62' + phoneNumber.slice(2)
  if (phoneNumber.startsWith('0')) return '+62' + phoneNumber.slice(1)
  return '+62' + phoneNumber
}
