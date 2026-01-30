import QRCode from 'qrcode'
import { NextResponse } from 'next/server'

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

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

   // 2️⃣ Load logo
  const logoPath = path.join(process.cwd(), 'public/logo.jpg')
  const logoBuffer = fs.readFileSync(logoPath)

  // 3️⃣ Resize logo (25% of QR)
  const logoSize = 256


  const resizedLogo = await sharp(logoBuffer)
    .resize(logoSize, logoSize)
    .png()
    .toBuffer()
  const logoWithBg = await sharp({
    create: {
      width: logoSize + 40,
      height: logoSize + 40,
      channels: 4,
      background: '#ffffff',
    },
  })
  .composite([{ input: resizedLogo, left: 20, top: 20 }])
    .png()
    .toBuffer()

    const finalQr = await sharp(buffer)
    .composite([
      {
        input: logoWithBg,
        gravity: 'center',
      },
    ])
    .png()
    .toBuffer()

  // @ts-ignore
  return new NextResponse(finalQr, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
