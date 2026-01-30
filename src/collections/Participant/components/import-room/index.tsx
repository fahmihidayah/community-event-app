'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react'
import { uploadRoomCsv } from '../../actions'

interface ImportRoomProps {
  eventId: string
}

export function ImportRoom({ eventId }: ImportRoomProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    updated?: number
    skipped?: number
    failed?: number
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await uploadRoomCsv(formData, eventId)
      setResult(response)

      if (response.success) {
        setFile(null)
        // Reset file input
        const fileInput = document.getElementById('room-file-input') as HTMLInputElement
        if (fileInput) {
          fileInput.value = ''
        }
        // Refresh the page after successful upload
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat upload',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="size-5" />
          Import Data Ruangan
        </CardTitle>
        <CardDescription>
          Upload file CSV untuk memperbarui data lantai, nomor kamar, dan kelompok peserta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            id="room-file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground">
            Format CSV: Lantai, Nomor Kamar, Kelompok, No, Nama, WhatsApp
          </p>
        </div>

        <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
          {isUploading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Mengupload...
            </>
          ) : (
            <>
              <Upload className="mr-2 size-4" />
              Upload CSV Ruangan
            </>
          )}
        </Button>

        {result && (
          <Alert variant={result.success ? 'default' : 'destructive'}>
            <AlertDescription>
              <p className="font-medium">{result.message}</p>
              {result.success && (
                <div className="mt-2 text-sm">
                  <p>✓ {result.updated} peserta diperbarui</p>
                  <p>⊘ {result.skipped} dilewati (tidak ditemukan)</p>
                  {result.failed! > 0 && <p>✗ {result.failed} gagal</p>}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="rounded-md bg-muted p-3 text-xs space-y-1">
          <p className="font-medium">Catatan:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Hanya peserta yang sudah ada yang akan diperbarui</li>
            <li>Pencocokan berdasarkan nama lengkap peserta</li>
            <li>Peserta yang tidak ditemukan akan dilewati</li>
            <li>File harus dalam format CSV dengan header yang sesuai</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
