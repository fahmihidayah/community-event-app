import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'User Management',
  },
  auth: {
    maxLoginAttempts: 0, // ✅ unlimited login attempts
    tokenExpiration: 60 * 60 * 24 * 30, // ✅ 1 month (30 days)
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
