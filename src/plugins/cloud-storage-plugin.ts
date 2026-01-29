import { s3Storage } from '@payloadcms/storage-s3'

export default function getCloudStoragePlugin() {
  return s3Storage({
    collections: {
      media: true,
    },
    bucket: process.env.CLOUD_STORAGE_BUCKET ?? '',
    config: {
      endpoint: process.env.CLOUD_STORAGE_ENDPOINT ?? '',
      credentials: {
        accessKeyId: process.env.CLOUD_STORAGE_ACCESS_KEY ?? '',
        secretAccessKey: process.env.CLOUD_STORAGE_SECRET ?? '',
      },
      region: 'region-12',
    },
  })
}
