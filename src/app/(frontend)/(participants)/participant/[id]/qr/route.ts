import QRCode from 'qrcode'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Current request URL (e.g. https://domain.com/participant/123/qr)
  const currentUrl = new URL(req.url)

  // Example: generate QR for participant dashboard page instead of /qr
  const targetUrl = `https://posku.kuttabalfatihmalang.com/dashboard/participants/${id}?status=confirm`

  // Generate QR as PNG buffer
  const buffer = await QRCode.toBuffer(targetUrl, {
    type: 'png',
    width: 1024,                 // 👈 BIG size (try 512 / 1024 / 2048)
    margin: 2,                   // white border
    errorCorrectionLevel: 'H',   // 👈 highest error correction (best for print)
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  })
  // @ts-ignore
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
