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
