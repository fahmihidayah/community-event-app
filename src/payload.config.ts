// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
// @ts-ignore - Module resolution issue with bundler mode
import { en } from '@payloadcms/translations/languages/en'
// @ts-ignore - Module resolution issue with bundler mode
import { id } from '@payloadcms/translations/languages/id'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users/config'
import { Posts } from './collections/Posts/config'
import { Categories } from './collections/Categories/config'
import { Media } from './collections/Media'
import { Event } from './collections/Event/config'
import { Participant } from './collections/Participant/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Posts, Categories, Media, Event, Participant],
  globals: [],
  editor: lexicalEditor(),
  localization: {
    locales: ['en', 'id'],
    defaultLocale: 'en',
    fallback: true,
  },
  i18n: {
    supportedLanguages: {
      en,
      id,
    },
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // getCloudStoragePlugin(),
    // storage-adapter-placeholder
  ],
})
