'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { uploadCsv } from '../../actions'

interface ImportCsvProps {
  eventId: string
  onImportComplete?: () => void
}

export function ImportCsv({ eventId, onImportComplete }: ImportCsvProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    imported: number
    failed: number
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast.error('Harap pilih file CSV')
      return
    }

    setIsUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await uploadCsv(formData, eventId)

      setResult(response)

      if (response.success) {
        toast.success(response.message)
        if (onImportComplete) {
          onImportComplete()
        }
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error uploading CSV:', error)
      toast.error('Terjadi kesalahan saat mengupload file')
      setResult({
        success: false,
        message: 'Terjadi kesalahan saat mengupload file',
        imported: 0,
        failed: 0,
      })
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Peserta dari CSV</CardTitle>
        <CardDescription>
          Upload file CSV untuk menambahkan peserta secara massal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            onClick={handleButtonClick}
            disabled={isUploading}
            className="w-full sm:w-auto"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="mr-2 size-4" />
                Pilih File CSV
              </>
            )}
          </Button>
        </div>

        {result && (
          <Alert variant={result.success ? 'default' : 'destructive'}>
            {result.success ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <XCircle className="size-4" />
            )}
            <AlertTitle>
              {result.success ? 'Import Berhasil' : 'Import Gagal'}
            </AlertTitle>
            <AlertDescription>
              {result.message}
              {result.success && (
                <div className="mt-2 text-sm">
                  <p>Berhasil diimpor: {result.imported}</p>
                  {result.failed > 0 && <p>Gagal: {result.failed}</p>}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">Format CSV yang diperlukan:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Email address (wajib)</li>
            <li>Nama Lengkap (wajib)</li>
            <li>Nomor Whatsapp</li>
            <li>Usia (tahun)</li>
            <li>Pekerjaan atau Usaha?</li>
            <li>Alamat Rumah/Tempat Tinggal</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
